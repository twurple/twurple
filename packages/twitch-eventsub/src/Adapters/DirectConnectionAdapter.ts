import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
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
@rtfm('twitch-eventsub', 'DirectConnectionAdapter')
export class DirectConnectionAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
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
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	get listenUsingSsl(): boolean {
		return true;
	}

	/** @protected */
	async getHostName(): Promise<string> {
		return this._hostName;
	}
}
