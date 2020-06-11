import ReverseProxyAdapter from './ReverseProxyAdapter';

/**
 * The configuration for the environment port connection adapter.
 */
export interface EnvPortAdapterConfig {
	/**
	 * The environment variable name the adapter should get the port from.
	 *
	 * @default PORT
	 */
	variableName?: string;

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
 * A connection adapter that reads the port to listen on from the environment.
 */
export default class EnvPortAdapter extends ReverseProxyAdapter {
	/**
	 * Creates a new environment port connection adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: EnvPortAdapterConfig) {
		const { variableName = 'PORT', ...otherOptions } = options;
		const listenerPort = Number(process.env[variableName || 'PORT']);
		if (Number.isNaN(listenerPort)) {
			throw new Error(`The environment variable "${variableName}" does not contain a number`);
		}
		super({ listenerPort, ...otherOptions });
	}
}
