import * as crypto from 'crypto';
import type { HelixEventSubSubscription, HelixEventSubTransportOptions } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubListener } from '../EventSubListener';

/** @private */
export type SubscriptionResultType<T extends EventSubSubscription> = T extends EventSubSubscription<infer O>
	? O
	: never;

/**
 * @hideProtected
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class EventSubSubscription</** @private */ T = any> {
	private _verified: boolean = false;
	private _twitchSubscriptionData?: HelixEventSubSubscription;
	private _unsubscribeResolver?: () => void;

	/** @private */
	protected constructor(protected _handler: (obj: T) => void, protected _client: EventSubListener) {}

	/**
	 * Whether the subscription has been verified by Twitch.
	 */
	get verified(): boolean {
		return this._verified;
	}

	private get _secret() {
		return `${this.id}.${this._client._secret}`;
	}

	/** @private */
	get _twitchId(): string | undefined {
		return this._twitchSubscriptionData?.id;
	}

	/** @private */
	_verify(): void {
		this._verified = true;
	}

	/** @private */
	_verifyData(messageId: string, timestamp: string, body: string, algoAndSignature: string): boolean {
		const [algorithm, signature] = algoAndSignature.split('=', 2);

		const hash = crypto
			.createHmac(algorithm, this._secret)
			.update(messageId + timestamp + body)
			.digest('hex');

		return hash === signature;
	}

	/** @private */
	_handleData(body: Record<string, unknown>): void {
		this._handler(this.transformData(body));
	}

	/** @private */
	_handleUnsubscribe(): boolean {
		if (this._unsubscribeResolver) {
			this._unsubscribeResolver();
			this._unsubscribeResolver = undefined;
			return true;
		}
		return false;
	}

	/**
	 * Activates the subscription.
	 */
	async start(resumeFrom?: HelixEventSubSubscription): Promise<void> {
		if (resumeFrom) {
			if (resumeFrom.status === 'enabled') {
				this._twitchSubscriptionData = resumeFrom;
				this._client._logger.debug(`Successfully resumed subscription for event: ${this.id}`);
				return;
			}

			this._client._logger.info(`Cycling broken conflicting subscription for event: ${this.id}`);
			await this._unsubscribe();
		}
		this._twitchSubscriptionData = await this._subscribe();
		this._client._registerTwitchSubscription(this.id, this._twitchSubscriptionData);
	}

	/**
	 * Suspends the subscription, not removing it from the listener.
	 */
	async suspend(): Promise<void> {
		if (!this._twitchSubscriptionData) {
			return;
		}
		const unsubscribePromise = new Promise<void>(resolve => (this._unsubscribeResolver = resolve));
		await this._unsubscribe();
		await unsubscribePromise;
		this._twitchSubscriptionData = undefined;
	}

	/**
	 * Deactivates the subscription and removes it from the listener.
	 */
	async stop(): Promise<void> {
		await this.suspend();
		this._client._dropSubscription(this.id);
	}

	protected async _getTransportOptions(): Promise<HelixEventSubTransportOptions> {
		return {
			method: 'webhook',
			callback: await this._client._buildHookUrl(this.id),
			secret: this._secret
		};
	}

	/** @private */
	abstract get id(): string;

	protected abstract _subscribe(): Promise<HelixEventSubSubscription>;

	protected abstract transformData(response: unknown): T;

	private async _unsubscribe() {
		if (this._twitchSubscriptionData) {
			await this._client._apiClient.helix.eventSub.deleteSubscription(this._twitchSubscriptionData.id);
		}
		this._client._dropTwitchSubscription(this.id);
	}
}
