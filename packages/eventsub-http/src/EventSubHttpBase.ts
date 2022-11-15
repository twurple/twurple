import getRawBody from '@d-fischer/raw-body';
import { Enumerable } from '@d-fischer/shared-utils';
import type {
	HelixEventSubSubscription,
	HelixEventSubSubscriptionStatus,
	HelixEventSubTransportData,
	HelixEventSubTransportOptions
} from '@twurple/api';
import { InvalidTokenTypeError } from '@twurple/auth';
import type { EventSubBaseConfig, EventSubSubscription } from '@twurple/eventsub-base';
import { EventSubBase } from '@twurple/eventsub-base';
import * as crypto from 'crypto';
import type { Request, RequestHandler } from 'httpanda';

/** @private */
interface EventSubSubscriptionBody {
	id: string;
	status: HelixEventSubSubscriptionStatus;
	type: string;
	version: string;
	condition: Record<string, string>;
	transport: HelixEventSubTransportData;
	created_at: string;
}

/** @private */
interface BaseEventSubBody {
	subscription: EventSubSubscriptionBody;
}

/** @private */
interface EventSubVerificationBody extends BaseEventSubBody {
	challenge: string;
}

/** @private */
interface EventSubNotificationBody extends BaseEventSubBody {
	event: Record<string, unknown>;
}

/** @private */
type EventSubBody = EventSubVerificationBody | EventSubNotificationBody;

/**
 * The base configuration for EventSub over HTTP.
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
	 */
	strictHostCheck?: boolean;
}

/**
 * @private
 * @hideProtected
 */
export abstract class EventSubHttpBase extends EventSubBase {
	@Enumerable(false) private readonly _seenEventIds = new Set<string>();

	/** @private */ @Enumerable(false) readonly _secret: string;

	/** @private */ readonly _strictHostCheck: boolean;

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
		super(config);
		if (config.apiClient._authProvider.tokenType !== 'app') {
			throw new InvalidTokenTypeError(
				'EventSub requires app access tokens to work; please use the ClientCredentialsAuthProvider in your API client.'
			);
		}
		// catch the examples copied verbatim
		if (!config.secret || config.secret === 'thisShouldBeARandomlyGeneratedFixedString') {
			throw new Error('Please generate a secret and pass it to the constructor!');
		}
		this._secret = config.secret;

		if (config.strictHostCheck === undefined) {
			this._logger
				.warn(`A new option named \`strictHostCheck\` was introduced in order to ignore access to your handler by wide-range vulnerability scanners (and thus dropping all the log messages caused by them).
Its default value is \`false\` for now, but will change to \`true\` in the next major release.
To enable this check and silence this warning, please add \`strictHostCheck: true\` to your EventSub configuration.
To silence this warning without enabling this check (and thus to keep it off even after a major release), please add \`strictHostCheck: false\` to your EventSub configuration.`);
		}
		this._strictHostCheck = config.strictHostCheck ?? false;
	}

	/** @private */
	async _buildHookUrl(id: string): Promise<string> {
		const hostName = await this.getHostName();

		// trim slashes on both ends
		const pathPrefix = (await this.getPathPrefix())?.replace(/^\/|\/$/, '');

		return `https://${hostName}${pathPrefix ? '/' : ''}${pathPrefix ?? ''}/event/${id}`;
	}

	/** @private */
	async _getTransportOptionsForSubscription(
		subscription: EventSubSubscription
	): Promise<HelixEventSubTransportOptions> {
		return {
			method: 'webhook',
			callback: await this._buildHookUrl(subscription.id),
			secret: this._createSecretForSubscription(subscription)
		};
	}

	/** @private */
	async _getCliTestCommandForSubscription(subscription: EventSubSubscription): Promise<string> {
		return `twitch event trigger ${subscription._cliName} -F ${await this._buildHookUrl(subscription.id)} -s ${
			this._secret
		}`;
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
							return [id, sub];
						}
					}
					return undefined;
				})
				.filter(<T>(x?: T): x is T => !!x)
		);

		await Promise.all(
			[...this._subscriptions].map(async ([subId, sub]) => await sub.start(this._twitchSubscriptions.get(subId)))
		);
	}

	protected _createHandleRequest(): RequestHandler {
		return async (req, res, next) => {
			if (req.readableEnded) {
				throw new Error(
					'The request body was already consumed by something else.\n' +
						"Please make sure you don't globally apply middlewares that consume the request body, " +
						'such as express.json() or body-parser.'
				);
			}

			if (await this._isHostDenied(req)) {
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(404);
				res.end('Not OK');
				return;
			}

			const { id } = req.params;
			const subscription = this._subscriptions.get(id);
			const twitchSubscription = this._twitchSubscriptions.get(id);
			const type = req.headers['twitch-eventsub-message-type'] as string;
			if (!subscription) {
				this._logger.warn(`Action ${type} of unknown event attempted: ${id}`);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(410);
				res.end('Not OK');
				return;
			}

			const messageId = req.headers['twitch-eventsub-message-id'] as string;
			const timestamp = req.headers['twitch-eventsub-message-timestamp'] as string;
			const body = await getRawBody(req, true);
			const algoAndSignature = req.headers['twitch-eventsub-message-signature'] as string | undefined;
			if (algoAndSignature === undefined) {
				this._logger.warn(`Dropping unsigned message for action ${type} of event: ${id}`);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(410);
				res.end('Not OK');
				return;
			}

			const verified = this._verifyData(subscription, messageId, timestamp, body, algoAndSignature);
			const data = JSON.parse(body) as EventSubBody;
			if (!verified) {
				this._logger.warn(`Could not verify action ${type} of event: ${id}`);
				if (type === 'webhook_callback_verification') {
					this.emit(this.onVerify, false, subscription);
				}
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(410);
				res.end('Not OK');
				return;
			}

			if (type === 'webhook_callback_verification') {
				const verificationBody = data as EventSubVerificationBody;
				this.emit(this.onVerify, true, subscription);
				subscription._verify();
				if (twitchSubscription) {
					twitchSubscription._status = 'enabled';
				}
				res.setHeader('Content-Length', verificationBody.challenge.length);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(200, undefined);
				res.end(verificationBody.challenge);
				this._logger.debug(`Successfully subscribed to event: ${id}`);
			} else if (type === 'notification') {
				if (this._seenEventIds.has(messageId)) {
					this._logger.debug(`Duplicate notification prevented for event: ${id}`);
				} else if (new Date(timestamp).getTime() < Date.now() - 10 * 60 * 1000) {
					this._logger.debug(`Old notification prevented for event: ${id}`);
				} else {
					this._seenEventIds.add(messageId);
					setTimeout(() => this._seenEventIds.delete(messageId), 10 * 60 * 1000);
					subscription._handleData((data as EventSubNotificationBody).event);
				}
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(202);
				res.end('OK');
			} else if (type === 'revocation') {
				this._dropSubscription(subscription.id);
				this._dropTwitchSubscription(subscription.id);
				this.emit(this.onRevoke, subscription);
				this._logger.debug(`Subscription revoked by Twitch for event: ${id}`);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(202);
				res.end('OK');
			} else {
				this._logger.warn(`Unknown action ${type} for event: ${id}`);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(400);
				res.end('Not OK');
			}
			next();
		};
	}

	protected _createDropLegacyRequest(): RequestHandler {
		return async (req, res, next) => {
			if (await this._isHostDenied(req)) {
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(404);
				res.end('Not OK');
				return;
			}

			const twitchSub = this._twitchSubscriptions.get(req.params.id);
			if (twitchSub) {
				await this._apiClient.eventSub.deleteSubscription(twitchSub.id);
				this._logger.debug(`Dropped legacy subscription for event: ${req.params.id}`);
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(410);
				res.end('Not OK');
			} else {
				next();
			}
		};
	}

	protected _createHandleHealthRequest(): RequestHandler {
		return async (req, res) => {
			res.setHeader('Content-Type', 'text/plain');
			if (await this._isHostDenied(req)) {
				res.writeHead(404);
				res.end('Not OK');
				return;
			}

			res.writeHead(200);
			res.end('@twurple/eventsub-http is listening here');
		};
	}

	protected async _isHostDenied(req: Request): Promise<boolean> {
		if (this._strictHostCheck) {
			const ip = req.socket.remoteAddress;
			if (ip === undefined) {
				// client disconnected already
				return true;
			}

			if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
				// localhost is always fine
				return false;
			}

			const host = req.headers.host;
			if (host === undefined) {
				this._logger.debug(`Denied request from ${ip} because its host header is empty`);
				return true;
			}

			const expectedHost = await this.getHostName();
			if (host !== expectedHost) {
				this._logger.debug(
					`Denied request from ${ip} because its host header (${host}) doesn't match the expected value (${expectedHost})`
				);
				return true;
			}
		}
		return false;
	}

	private _verifyData(
		subscription: EventSubSubscription,
		messageId: string,
		timestamp: string,
		body: string,
		algoAndSignature: string
	): boolean {
		const [algorithm, signature] = algoAndSignature.split('=', 2);

		const hash = crypto
			.createHmac(algorithm, this._createSecretForSubscription(subscription))
			.update(messageId + timestamp + body)
			.digest('hex');

		return hash === signature;
	}

	private _createSecretForSubscription(subscription: EventSubSubscription) {
		return `${subscription.id}.${this._secret}`.slice(-100);
	}
}
