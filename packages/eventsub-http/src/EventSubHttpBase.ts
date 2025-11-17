import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixEventSubSubscription, HelixEventSubWebHookTransportOptions } from '@twurple/api';
import {
	EventSubBase,
	type EventSubBaseConfig,
	type EventSubNotificationPayload,
	type EventSubRevocationPayload,
	type EventSubSubscription,
	type EventSubSubscriptionBody,
} from '@twurple/eventsub-base';
import * as crypto from 'crypto';
import {
	defineHandler,
	type EventHandler,
	getRequestHost,
	getRequestIP,
	getRouterParam,
	type H3Event,
	HTTPError,
	readBody,
} from 'h3';

/** @private */
export interface EventSubVerificationPayload {
	subscription: EventSubSubscriptionBody;
	challenge: string;
}

/** @private */
export type EventSubHttpPayload = EventSubVerificationPayload | EventSubNotificationPayload | EventSubRevocationPayload;

/**
 * The base configuration for EventSub over HTTP.
 *
 * @inheritDoc
 */
export interface EventSubHttpBaseConfig extends EventSubBaseConfig {
	/**
	 * Your EventSub secret.
	 *
	 * This should be a randomly generated string, but it should be the same between restarts.
	 *
	 * WARNING: Please do not use your application's client secret!
	 */
	secret: string;

	/**
	 * Whether to ignore packets that are not sent with a Host header matching the configured host name.
	 *
	 * Enabled by default. Set this to `false` to disable it.
	 */
	strictHostCheck?: boolean;

	/**
	 * Whether to add additional helper routes such as the test route at the root.
	 *
	 * Enabled by default. Set this to `false` to disable it.
	 */
	helperRoutes?: boolean;
}

/**
 * @private
 * @hideProtected
 * @inheritDoc
 */
export abstract class EventSubHttpBase extends EventSubBase {
	/** @internal */ @Enumerable(false) private readonly _secret: string;

	private readonly _strictHostCheck: boolean;
	protected readonly _helperRoutes: boolean;

	protected _readyToSubscribe = false;

	/**
	 * Fires when a subscription is successfully verified or fails to verify.
	 *
	 * @eventListener
	 *
	 * @param success Whether the verification succeeded.
	 * @param subscription The subscription that was verified.
	 */
	readonly onVerify = this.registerEvent<[success: boolean, subscription: EventSubSubscription]>();

	constructor(config: EventSubHttpBaseConfig) {
		// catch the examples copied verbatim
		if (!config.secret || config.secret === 'thisShouldBeARandomlyGeneratedFixedString') {
			throw new Error('Please generate a secret and pass it to the constructor!');
		}
		if (config.secret.length < 10 || config.secret.length > 100) {
			throw new Error('Your secret must be between 10 and 100 characters long');
		}
		super(config);
		this._secret = config.secret;
		this._strictHostCheck = config.strictHostCheck ?? true;
		this._helperRoutes = config.helperRoutes ?? true;
	}

	/** @private */
	async _getTransportOptionsForSubscription(
		subscription: EventSubSubscription,
	): Promise<HelixEventSubWebHookTransportOptions> {
		return {
			method: 'webhook',
			callback: await this._buildHookUrl(subscription.id),
			secret: this._secret,
		};
	}

	/** @private */
	async _getCliTestCommandForSubscription(subscription: EventSubSubscription): Promise<string> {
		return `twitch event trigger ${subscription._cliName} -T webhook -F ${await this._buildHookUrl(
			subscription.id,
		)} -s ${this._secret}`;
	}

	/** @private */
	_isReadyToSubscribe(): boolean {
		return this._readyToSubscribe;
	}

	protected abstract getHostName(): Promise<string>;

	protected abstract getPathPrefix(): Promise<string | undefined>;

	protected async _resumeExistingSubscriptions(): Promise<void> {
		const subscriptions = await this._apiClient.eventSub.getSubscriptionsPaginated().getAll();

		const urlPrefix = await this._buildHookUrl('');
		this._twitchSubscriptions = new Map<string, HelixEventSubSubscription>(
			subscriptions
				.map((sub): [string, HelixEventSubSubscription] | undefined => {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (sub._transport.method === 'webhook') {
						const url = sub._transport.callback;
						if (url.startsWith(urlPrefix)) {
							const id = url.slice(urlPrefix.length);
							if (!id.includes('/')) {
								return [id, sub];
							}
						}
					}
					return undefined;
				})
				.filter(<T>(x?: T): x is T => !!x),
		);

		for (const [subId, sub] of this._subscriptions) {
			sub.start(this._twitchSubscriptions.get(subId));
		}
	}

	protected _createHandleRequest(): EventHandler {
		return defineHandler(async event => {
			// TODO do we need this?
			// if (req.readableEnded) {
			// 	next(
			// 		new Error(
			// 			'The request body was already consumed by something else.\n' +
			// 				"Please make sure you don't globally apply middlewares that consume the request body, " +
			// 				'such as express.json() or body-parser.',
			// 		),
			// 	);
			//
			// 	return;
			// }

			// The HTTP listener intentionally does not use the built-in resolution by Twitch subscription ID
			// to be able to recognize subscriptions from the URL (for avoiding unnecessary re-subscribing)

			const id = getRouterParam(event, 'id');
			const subscription = this._subscriptions.get(id!);
			const twitchSubscription = this._twitchSubscriptions.get(id!);
			const type = event.req.headers.get('twitch-eventsub-message-type');
			if (!subscription) {
				this._logger.warn(`Action ${type} of unknown event attempted: ${id}`);
				throw HTTPError.status(410, 'Not OK');
			}

			const messageId = event.req.headers.get('twitch-eventsub-message-id');
			const timestamp = event.req.headers.get('twitch-eventsub-message-timestamp');
			const body = await event.req.text();
			const algoAndSignature = event.req.headers.get('twitch-eventsub-message-signature');
			if (!messageId || !timestamp || !body || !algoAndSignature) {
				throw HTTPError.status(400, 'Not OK');
				// TODO fixme
			}
			if (!algoAndSignature) {
				this._logger.warn(`Dropping unsigned message for action ${type} of event: ${id}`);
				throw HTTPError.status(410, 'Not OK');
			}

			const verified = this._verifyData(messageId, timestamp, body, algoAndSignature);
			if (!verified) {
				this._logger.warn(`Could not verify action ${type} of event: ${id}`);
				if (type === 'webhook_callback_verification') {
					this.emit(this.onVerify, false, subscription);
				}
				throw HTTPError.status(410, 'Not OK');
			}

			switch (type) {
				case 'webhook_callback_verification': {
					const verificationBody = await readBody<EventSubVerificationPayload>(event);

					this.emit(this.onVerify, true, subscription);
					subscription._verify();
					if (twitchSubscription) {
						twitchSubscription._status = 'enabled';
					}
					this._logger.debug(`Successfully subscribed to event: ${id}`);
					return verificationBody!.challenge;
				}
				case 'notification': {
					const processEvents = async () => {
						if (new Date(timestamp).getTime() < Date.now() - 10 * 60 * 1000) {
							this._logger.debug(`Old notification(s) prevented for event: ${id}`);
							return;
						}
						const payload = await readBody<EventSubNotificationPayload>(event);
						if ('events' in payload!) {
							for (const event of payload.events) {
								this._handleSingleEventPayload(subscription, event.data, event.id);
							}
						} else {
							this._handleSingleEventPayload(subscription, payload!.event, messageId);
						}
					};

					// respond before handling payloads to make sure there is no timeout
					event.waitUntil(processEvents());
					event.res.status = 202;
					return 'OK';
				}
				case 'revocation': {
					const revocationBody = await readBody<EventSubRevocationPayload>(event);
					this._dropSubscription(subscription.id);
					this._dropTwitchSubscription(subscription.id);
					this.emit(this.onRevoke, subscription, revocationBody!.subscription.status);
					this._logger.debug(`Subscription revoked by Twitch for event: ${id}`);
					event.res.status = 202;
					return 'OK';
				}
				default: {
					this._logger.warn(`Unknown action ${type} for event: ${id}`);
					throw HTTPError.status(400, 'Not OK');
				}
			}
		});
	}

	protected _createDropLegacyRequest(): EventHandler {
		return defineHandler(async event => {
			const id = getRouterParam(event, 'id');

			const twitchSub = this._twitchSubscriptions.get(id!);
			if (twitchSub) {
				await this._apiClient.eventSub.deleteSubscription(twitchSub.id);
				this._logger.debug(`Dropped legacy subscription for event: ${id}`);
				throw HTTPError.status(410, 'Not OK');
			}
		});
	}

	protected _createHandleHealthRequest(): EventHandler {
		return defineHandler(async event => '@twurple/eventsub-http is listening here');
	}

	protected async _isHostDenied(event: H3Event, next: () => unknown) {
		// TODO add this middleware to the server
		if (this._strictHostCheck) {
			const ip = getRequestIP(event, { xForwardedFor: false }); // TODO set this if reverse proxy is used
			if (!ip) {
				// client disconnected already
				throw HTTPError.status(404, 'Not OK');
			}

			if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
				// localhost is always fine
				await next();
			}

			const host = getRequestHost(event, { xForwardedHost: false }); // TODO set this if reverse proxy is used

			if (!host) {
				this._logger.debug(`Denied request from ${ip} because its host header is empty`);
				throw HTTPError.status(404, 'Not OK');
			}

			const expectedHost = await this.getHostName();
			if (host !== expectedHost) {
				this._logger.debug(
					`Denied request from ${ip} because its host header (${host}) doesn't match the expected value (${expectedHost})`,
				);
				throw HTTPError.status(404, 'Not OK');
			}
		}
		await next();
	}

	protected _findTwitchSubscriptionToContinue(
		subscription: EventSubSubscription,
	): HelixEventSubSubscription | undefined {
		return this._twitchSubscriptions.get(subscription.id);
	}

	/** @internal */
	private async _buildHookUrl(id: string): Promise<string> {
		const hostName = await this.getHostName();

		// trim slashes on both ends
		const pathPrefix = (await this.getPathPrefix())?.replace(/^\/|\/$/, '');

		return `https://${hostName}${pathPrefix ? '/' : ''}${pathPrefix ?? ''}/event/${id}`;
	}

	/** @internal */
	private _verifyData(messageId: string, timestamp: string, body: string, algoAndSignature: string): boolean {
		const signaturePrefix = 'sha256=';
		if (!algoAndSignature.startsWith(signaturePrefix)) {
			return false;
		}

		const signature = algoAndSignature.substring(signaturePrefix.length);
		const expected = Buffer.from(signature, 'hex');
		const hash = crypto
			.createHmac('sha256', this._secret)
			.update(messageId + timestamp + body)
			.digest();

		return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
	}
}
