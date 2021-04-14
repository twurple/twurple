import { rtfm } from '@twurple/common';
import { ConnectionAdapter } from './ConnectionAdapter';

/**
 * The configuration of the reverse proxy connection adapter.
 *
 * @inheritDoc
 */
export interface ReverseProxyAdapterConfig {
	/**
	 * The port the server should listen to.
	 */
	port?: number;

	/**
	 * The host name the reverse proxy is available under.
	 */
	hostName: string;

	/**
	 * The port on which the reverse proxy is available.
	 *
	 * @default 443
	 */
	externalPort?: number;

	/**
	 * The path prefix your reverse proxy redirects to the listener.
	 */
	pathPrefix?: string;
}

/**
 * A WebHook connection adapter that supports a reverse proxy in front of the listener.
 *
 * @hideProtected
 */
@rtfm('eventsub', 'ReverseProxyAdapter')
export class ReverseProxyAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
	private readonly _port: number;
	private readonly _externalPort: number;
	private readonly _pathPrefix?: string;

	/**
	 * Creates a reverse proxy connection adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: ReverseProxyAdapterConfig) {
		super();
		this._hostName = options.hostName;
		this._port = options.port ?? 8080;
		this._externalPort = options.externalPort ?? 443;
		this._pathPrefix = options.pathPrefix;
	}

	/** @protected */
	async getListenerPort(): Promise<number> {
		return this._port;
	}

	/** @protected */
	async getExternalPort(): Promise<number> {
		return this._externalPort;
	}

	/** @protected */
	async getHostName(): Promise<string> {
		return this._hostName;
	}

	/** @protected */
	get pathPrefix(): string | undefined {
		return this._pathPrefix;
	}
}
