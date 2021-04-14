import { rtfm } from '@twurple/common';
import { ReverseProxyAdapter } from './ReverseProxyAdapter';

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
	 * The port on which the reverse proxy is available.
	 *
	 * @default 443
	 */
	port?: number;
}

/**
 * A connection adapter that reads the port to listen on from the environment.
 *
 * @hideProtected
 */
@rtfm('eventsub', 'EnvPortAdapter')
export class EnvPortAdapter extends ReverseProxyAdapter {
	/**
	 * Creates a new environment port connection adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: EnvPortAdapterConfig) {
		const { variableName = 'PORT', ...otherOptions } = options;
		const port = Number(process.env[variableName || 'PORT']);
		if (Number.isNaN(port)) {
			throw new Error(`The environment variable "${variableName}" does not contain a number`);
		}
		super({ port, ...otherOptions });
	}
}
