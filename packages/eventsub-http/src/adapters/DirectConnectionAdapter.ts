import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type * as http from 'http';
import * as https from 'https';
import { checkHostName } from '../checks';
import type { EventSubHttpListenerCertificateConfig } from '../EventSubHttpListener';
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
	sslCert: EventSubHttpListenerCertificateConfig;
}

/**
 * A WebHook connection adapter that enables a direct connection.
 *
 * Requires the server to be directly available to the internet.
 *
 * @hideProtected
 *
 * @meta category adapters
 */
@rtfm('eventsub-http', 'DirectConnectionAdapter')
export class DirectConnectionAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
	/** @internal */ @Enumerable(false) private _ssl: EventSubHttpListenerCertificateConfig;
	/** @internal */ @Enumerable(false) private _httpsServer?: https.Server;

	/**
	 * Creates a new simple WebHook adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: DirectConnectionAdapterConfig) {
		super();

		checkHostName(options.hostName);

		this._hostName = options.hostName;
		this._ssl = options.sslCert;
	}

	/**
	 * Updates the SSL certificate, for example if the old one is expired.
	 *
	 * @expandParams
	 *
	 * @param ssl The new certificate data.
	 */
	updateSslCertificate(ssl: EventSubHttpListenerCertificateConfig): void {
		this._ssl = ssl;
		this._httpsServer?.setSecureContext(ssl);
	}

	/** @protected */
	createHttpServer(): http.Server {
		return (this._httpsServer = https.createServer({
			key: this._ssl.key,
			cert: this._ssl.cert,
		}));
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
