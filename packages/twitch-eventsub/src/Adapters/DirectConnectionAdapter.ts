import { Enumerable } from '@d-fischer/shared-utils';
import type * as http from 'http';
import * as https from 'https';
import type { EventSubListenerCertificateConfig } from '../EventSubListener';
import { ConnectionAdapter } from './ConnectionAdapter';

/**
 * The configuration of the simple connection adapter.
 */
export interface DirectConnectionAdapterConfig {
	/**
	 * The host name the server is available under.
	 */
	hostName: string;

	/**
	 * The port the server should listen to.
	 */
	port: number;

	/**
	 * The SSL keychain that should be used to make the server available using a secure connection.
	 */
	sslCert: EventSubListenerCertificateConfig;
}

/**
 * A WebHook connection adapter that enables a direct connection.
 *
 * Requires the server to be directly available to the internet.
 *
 * @hideProtected
 */
export class DirectConnectionAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
	private readonly _port: number;
	@Enumerable(false) private readonly _ssl: EventSubListenerCertificateConfig;

	/**
	 * Creates a new simple WebHook adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: DirectConnectionAdapterConfig) {
		super();
		this._hostName = options.hostName;
		this._port = options.port;
		this._ssl = options.sslCert;
	}

	/** @protected */
	createHttpServer(): http.Server {
		return https.createServer({
			key: this._ssl.key,
			cert: this._ssl.cert
		});
	}

	/** @protected */
	get listenUsingSsl(): boolean {
		return true;
	}

	/** @protected */
	async getListenerPort(): Promise<number> {
		return this._port;
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
