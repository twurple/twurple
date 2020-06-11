import { getPortPromise } from '@d-fischer/portfinder';
import { connect } from 'ngrok';
import { ConnectionAdapter } from 'twitch-webhooks';

/**
 * A connection adapter that uses ngrok to make local testing easy.
 */
export default class NgrokAdapter extends ConnectionAdapter {
	private _listenerPortPromise?: Promise<number>;
	private _hostNamePromise?: Promise<string>;

	/**
	 * Creates a new ngrok connection adapter.
	 */
	constructor() {
		// stub out listener port, we'll find out for ourselves
		super({ listenerPort: -1 });
	}

	/** @protected */
	get connectUsingSsl(): boolean {
		return true;
	}

	/** @protected */
	async getListenerPort() {
		if (!this._listenerPortPromise) {
			this._listenerPortPromise = getPortPromise();
		}

		return this._listenerPortPromise;
	}

	/** @protected */
	async getExternalPort(): Promise<number> {
		return 443;
	}

	/** @protected */
	async getHostName(): Promise<string> {
		const listenerPort = await this.getListenerPort();

		if (!this._hostNamePromise) {
			this._hostNamePromise = connect({ addr: listenerPort }).then(url => url.replace(/^https?:\/\/|\/$/, ''));
		}

		return this._hostNamePromise;
	}
}
