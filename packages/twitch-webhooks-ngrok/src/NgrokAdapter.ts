import { getPortPromise } from '@d-fischer/portfinder';
import { Enumerable } from '@d-fischer/shared-utils';
import { connect } from 'ngrok';
import type { ConnectionAdapterOverrideOptions } from 'twitch-webhooks';
import { ConnectionAdapter } from 'twitch-webhooks';

/**
 * A connection adapter that uses ngrok to make local testing easy.
 */
export class NgrokAdapter extends ConnectionAdapter {
	@Enumerable(false) private _listenerPortPromise?: Promise<number>;
	@Enumerable(false) private _hostNamePromise?: Promise<string>;

	/**
	 * Creates a new ngrok connection adapter.
	 */
	constructor() {
		// stub out listener port, we'll find out for ourselves
		super({ listenerPort: -1 });
	}

	/** @protected */
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	get connectUsingSsl(): boolean {
		return true;
	}

	/** @protected */
	async getListenerPort(): Promise<number> {
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

	get overrideOptions(): ConnectionAdapterOverrideOptions {
		return {
			defaultHookValidity: 60
		};
	}
}
