import { CommonConnectionAdapterConfig, ConnectionAdapter } from './ConnectionAdapter';

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
	get connectUsingSsl() {
		return this.listenUsingSsl;
	}

	/** @protected */
	async getExternalPort() {
		return this.getListenerPort();
	}

	/** @protected */
	async getHostName() {
		return this._hostName;
	}
}
