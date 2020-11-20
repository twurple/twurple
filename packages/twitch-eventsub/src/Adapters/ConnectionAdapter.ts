import { Enumerable } from '@d-fischer/shared-utils';
import * as http from 'http';
import * as https from 'https';
import type { EventSubListenerCertificateConfig } from '../EventSubListener';

/** @protected */
export interface CommonConnectionAdapterConfig {
	/**
	 * The port the server should listen to.
	 */
	listenerPort: number;

	/**
	 * The SSL keychain that should be used to make the server available using a secure connection.
	 *
	 * If this is not given and there is no reverse proxy that handles incoming SSL connections, the server will only be available via HTTP.
	 * This means it can **only listen to unauthenticated topics** (stream changes and follows).
	 */
	sslCert?: EventSubListenerCertificateConfig;
}

/**
 * An abstraction of a WebHook connection adapter.
 */
export abstract class ConnectionAdapter {
	private readonly _listenerPort: number;
	@Enumerable(false) private readonly _ssl?: EventSubListenerCertificateConfig;

	/**
	 * Creates a new instance of the connection adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: CommonConnectionAdapterConfig) {
		this._listenerPort = options.listenerPort;
		this._ssl = options.sslCert;
	}

	/**
	 * Creates the HTTP server to use for listening to events.
	 *
	 * @protected
	 */
	createHttpServer(): http.Server {
		if (this._ssl) {
			return https.createServer({
				key: this._ssl.key,
				cert: this._ssl.cert
			});
		}
		return http.createServer();
	}

	/**
	 * Whether the connection adapter listens using SSL.
	 *
	 * @protected
	 */
	get listenUsingSsl(): boolean {
		return !!this._ssl;
	}

	/**
	 * The port the HTTP server should listen on.
	 *
	 * @protected
	 */
	async getListenerPort(): Promise<number> {
		return this._listenerPort;
	}

	/**
	 * Returns the host name that should be used by Twitch to connect to this server.
	 *
	 * @protected
	 */
	abstract async getHostName(): Promise<string>;

	/**
	 * Returns the port that should be used by Twitch to connect to this server.
	 *
	 * @protected
	 */
	abstract async getExternalPort(): Promise<number>;

	/**
	 * Whether to use SSL to connect to this server.
	 *
	 * This has nothing to do with the SSL configuration given.
	 * For example, this can be true when a reverse proxy takes care of SSL and routes to this server internally using plain HTTP.
	 *
	 * @protected
	 */
	abstract get connectUsingSsl(): boolean;

	/**
	 * The path prefix an external connection needs to reach this server.
	 *
	 * Please note that the layer redirecting to this server needs to strip the path prefix in order for this to work.
	 *
	 * For example, if this is set to /hooks, an external connection to /hooks/abc should pass /abc as the path to this server.
	 *
	 * @protected
	 */
	get pathPrefix(): string | undefined {
		return undefined;
	}
}
