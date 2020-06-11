import ConnectionAdapter, { CommonConnectionAdapterConfig } from './ConnectionAdapter';

/**
 * The configuration of the reverse proxy connection adapter.
 *
 * @inheritDoc
 */
export interface ReverseProxyAdapterConfig extends CommonConnectionAdapterConfig {
	/**
	 * The host name the reverse proxy is available under.
	 */
	hostName: string;

	/**
	 * Whether the reverse proxy supports SSL.
	 *
	 * @default true
	 */
	ssl?: boolean;

	/**
	 * The port on which the reverse proxy is available.
	 *
	 * @default ssl ? 443 : 80
	 */
	port?: number;
}

/**
 * A WebHook connection adapter that supports a reverse proxy in front of the listener.
 *
 * @hideProtected
 */
export default class ReverseProxyAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
	private readonly _connectUsingSsl: boolean;
	private readonly _port: number;

	/**
	 * Creates a reverse proxy connection adapter.
	 *
	 * @param options
	 */
	constructor(options: ReverseProxyAdapterConfig) {
		super(options);
		this._hostName = options.hostName;
		this._connectUsingSsl = options.ssl ?? true;
		this._port = options.port ?? (this._connectUsingSsl ? 443 : 80);
	}

	/** @protected */
	get connectUsingSsl(): boolean {
		return this._connectUsingSsl;
	}

	/** @protected */
	async getExternalPort(): Promise<number> {
		return this._port;
	}

	/** @protected */
	async getHostName(): Promise<string> {
		return this._hostName;
	}
}
