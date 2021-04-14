import { rtfm } from '@twurple/common';
import type { CommonConnectionAdapterConfig } from './ConnectionAdapter';
import { ConnectionAdapter } from './ConnectionAdapter';

/**
 * The configuration of the simple connection adapter.
 *
 * @inheritDoc
 */
export interface SimpleAdapterConfig extends CommonConnectionAdapterConfig {
	/**
	 * The host name the server is available under.
	 */
	hostName: string;
}

/**
 * A simple WebHook connection adapter. Requires the server to be directly available to the internet.
 *
 * @hideProtected
 */
@rtfm('webhooks', 'SimpleAdapter')
export class SimpleAdapter extends ConnectionAdapter {
	private readonly _hostName: string;

	/**
	 * Creates a new simple WebHook adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: SimpleAdapterConfig) {
		super(options);
		this._hostName = options.hostName;
	}

	/** @protected */
	get connectUsingSsl(): boolean {
		return this.listenUsingSsl;
	}

	/** @protected */
	async getExternalPort(): Promise<number> {
		return this.getListenerPort();
	}

	/** @protected */
	async getHostName(): Promise<string> {
		return this._hostName;
	}
}
