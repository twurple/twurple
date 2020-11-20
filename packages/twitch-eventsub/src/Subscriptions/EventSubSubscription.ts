import generateRandomString from '@d-fischer/randomstring';
import * as crypto from 'crypto';
import type { HelixEventSubSubscription, HelixEventSubTransportOptions } from 'twitch';
import type { EventSubListener } from '../EventSubListener';

/** @private */
export type SubscriptionResultType<T extends EventSubSubscription> = T extends EventSubSubscription<infer O>
	? O
	: never;

/**
 * @hideProtected
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class EventSubSubscription</** @private */ T = any> {
	private _verified: boolean = false;
	protected _secret: string;
	private _subscriptionData: HelixEventSubSubscription;
	private _unsubscribeResolver?: () => void;

	/** @private */
	protected constructor(protected _handler: (obj: T) => void, protected _client: EventSubListener) {}

	/**
	 * Whether the subscription has been verified by Twitch.
	 */
	get verified(): boolean {
		return this._verified;
	}

	/** @private */
	_verify(): void {
		this._verified = true;
	}

	/** @private */
	_generateNewCredentials(): void {
		this._secret = generateRandomString(16);
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
	_handleData(body: object): void {
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
	async start(): Promise<void> {
		await this._createNewSubscription();
	}

	/**
	 * Suspends the subscription, not removing it from the listener.
	 */
	async suspend(): Promise<void> {
		if (!this._subscriptionData) {
			return;
		}
		const unsubscribePromise = new Promise(resolve => (this._unsubscribeResolver = resolve));
		await this._client._apiClient.helix.eventSub.deleteSubscription(this._subscriptionData.id);
		await unsubscribePromise;
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

	protected abstract transformData(response: object): T;

	private async _createNewSubscription() {
		this._generateNewCredentials();
		await this._subscribe();
	}
}
