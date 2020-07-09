import { getPortPromise } from '@d-fischer/portfinder';
import { v4 } from '@d-fischer/public-ip';
import { WebHookConfig, WebHookListenerCertificateConfig } from '../WebHookListener';
import { CommonConnectionAdapterConfig, ConnectionAdapter } from './ConnectionAdapter';

/**
 * The configuration of a reverse proxy that the listener may be behind.
 */
export interface WebHookListenerReverseProxyConfig {
	/**
	 * The port your reverse proxy is available under.
	 */
	port?: number;

	/**
	 * Whether your reverse proxy is available using SSL on the given port.
	 */
	ssl?: boolean;

	/**
	 * The path prefix your reverse proxy redirects to the listener.
	 *
	 * Please keep in mind that this prefix needs to be stripped from the URL in order for the listener to work properly.
	 *
	 * For example, if you make your reverse proxy redirect any requests to https://twitchapp.example.com/hooks to the listener, the proxy needs to transform the URL from `/hooks/:name` to `/:name`.
	 */
	pathPrefix?: string;
}

/**
 * Legacy configuration of a WebHook listener.
 *
 * @inheritDoc
 */
export interface WebHookListenerConfig extends WebHookConfig {
	/**
	 * The host name the server will be available under.
	 *
	 * This is not an URL, but a plain host name, so it shouldn't contain `http://` or `https://` or any slashes.
	 *
	 * If not given, your IPv4 address will be automatically determined using a web service.
	 */
	hostName?: string;

	/**
	 * The port the server should listen to, and unless `reverseProxy` configuration is given, also the port it's available under.
	 *
	 * If not given, a free port will be automatically determined.
	 */
	port?: number;

	/**
	 * The SSL keychain that should be used to make the server available using a secure connection.
	 *
	 * If this is not given and `config.reverseProxy.ssl` is not true, the server will only be available via HTTP.
	 * This means it can **only listen to unauthenticated topics** (stream changes and follows).
	 */
	ssl?: WebHookListenerCertificateConfig;

	/**
	 * Configuration of a reverse proxy that the listener may be behind.
	 */
	reverseProxy?: WebHookListenerReverseProxyConfig;
}

/** @private */
interface WebHookListenerComputedConfig extends CommonConnectionAdapterConfig {
	hostName: string;
	connectUsingSsl: boolean;
	externalPort: number;
	pathPrefix?: string;
}

/**
 * A WebHook connection adapter to support the "old style" options.
 *
 * @deprecated Use literally *any* other connection adapter instead.
 * @hideProtected
 */
export class LegacyAdapter extends ConnectionAdapter {
	/**
	 * Takes the legacy WebHookListenerConfig and creates a connection adapter from it.
	 *
	 * @expandParams
	 */
	static async create(config: WebHookListenerConfig) {
		const listenerPort = config.port || (await getPortPromise());
		const reverseProxy = config.reverseProxy || {};
		return new LegacyAdapter({
			hostName: config.hostName || (await v4()),
			listenerPort: listenerPort,
			sslCert: config.ssl,
			connectUsingSsl: reverseProxy.ssl === undefined ? !!config.ssl : reverseProxy.ssl,
			externalPort: reverseProxy.port || listenerPort,
			pathPrefix: reverseProxy.pathPrefix
		});
	}

	/** @private */
	constructor(private readonly _config: WebHookListenerComputedConfig) {
		super(_config);
	}

	/** @protected */
	get connectUsingSsl(): boolean {
		return this._config.connectUsingSsl;
	}

	/** @protected */
	get pathPrefix(): string | undefined {
		return this._config.pathPrefix;
	}

	/** @protected */
	async getExternalPort() {
		return this._config.externalPort;
	}

	/** @protected */
	async getHostName() {
		return this._config.hostName;
	}
}
