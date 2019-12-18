import * as crypto from 'crypto';
import * as randomstring from 'randomstring';
import { HelixWebHookHubRequestOptions } from 'twitch/lib/API/Helix/WebHooks/HelixWebHooksAPI';
import WebHookListener from '../WebHookListener';

/**
 * @hideProtected
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default abstract class Subscription<T = any> {
	private _verified: boolean = false;
	protected _secret: string;
	private _refreshTimer?: NodeJS.Timer;

	/** @private */
	constructor(
		protected _handler: (obj: T) => void,
		protected _client: WebHookListener,
		private _validityInSeconds: number = 100000
	) {}

	get verified() {
		return this._verified;
	}

	/** @private */
	_verify() {
		this._verified = true;
	}

	/** @private */
	_generateNewCredentials() {
		this._secret = randomstring.generate(16);
	}

	protected get _options(): HelixWebHookHubRequestOptions {
		return {
			callbackUrl: this._client.buildHookUrl(this.id),
			secret: this._secret,
			validityInSeconds: this._validityInSeconds
		};
	}

	/** @private */
	_handleData(data: string, algoAndSignature: string) {
		const [algorithm, signature] = algoAndSignature.split('=', 2);

		const hash = crypto
			.createHmac(algorithm, this._secret)
			.update(data)
			.digest('hex');

		if (hash === signature) {
			this._handler(this.transformData(JSON.parse(data)));
		}
	}

	async start() {
		if (this._refreshTimer) {
			clearInterval(this._refreshTimer);
		}
		await this._createNewSubscription();
		this._refreshTimer = setInterval(async () => {
			await this._createNewSubscription();
		}, this._validityInSeconds * 800); // refresh a little bit faster than we could theoretically make work, but in millis
	}

	async stop() {
		if (this._refreshTimer) {
			clearInterval(this._refreshTimer);
			this._refreshTimer = undefined;
		}
		await this._unsubscribe();
		this._client._dropSubscription(this.id);
	}

	abstract get id(): string;

	protected abstract _subscribe(): Promise<void>;

	protected abstract _unsubscribe(): Promise<void>;

	protected abstract transformData(response: object): T;

	private async _createNewSubscription() {
		this._generateNewCredentials();
		await this._subscribe();
	}
}
