import WebHookListener from '../WebHookListener';
import * as uuidv1 from 'uuid/v1';
import * as randomstring from 'randomstring';
import * as crypto from 'crypto';
import { HelixWebHookHubRequestOptions } from 'twitch/lib/API/Helix/WebHooks/HelixWebHooksAPI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default abstract class Subscription<T = any> {
	private _verified: boolean = false;
	protected _id?: string;
	protected _secret: string;
	private _refreshTimer?: NodeJS.Timer;

	constructor(protected _handler: (obj: T) => void, protected _client: WebHookListener) {
	}

	get verified() {
		return this._verified;
	}

	verify() {
		this._verified = true;
	}

	generateNewCredentials() {
		this._id = uuidv1();
		this._secret = randomstring.generate(16);
	}

	get id() {
		return this._id;
	}

	protected get _options(): HelixWebHookHubRequestOptions {
		return {
			callbackUrl: this._client.buildHookUrl(this._id!),
			secret: this._secret,
			validityInSeconds: 100000
		};
	}

	handleData(data: string, algoAndSignature: string) {
		const [algorithm, signature] = algoAndSignature.split('=', 2);

		const hash = crypto.createHmac(algorithm, this._secret)
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
		this._refreshTimer = setInterval(
			async () => {
				await this._createNewSubscription();
			},
			86400000
		);
	}

	async stop() {
		if (this._refreshTimer) {
			clearInterval(this._refreshTimer);
			this._refreshTimer = undefined;
		}
		await this._unsubscribe();
		this._client._dropSubscription(this._id!);
		this._id = undefined;
	}

	private async _createNewSubscription() {
		const oldId = this._id;
		this.generateNewCredentials();
		if (oldId) {
			this._client._changeIdOfSubscription(oldId, this._id!);
		}
		await this._subscribe();
	}

	protected abstract _subscribe(): Promise<void>;

	protected abstract _unsubscribe(): Promise<void>;

	abstract transformData(response: object): T;
}
