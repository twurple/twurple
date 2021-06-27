import { rtfm } from '@twurple/common';
import { ConnectionAdapter } from './ConnectionAdapter';

/**
 * The configuration of the middleware connection adapter.
 */
export interface MiddlewareAdapterConfig {
	/**
	 * The host name the root application is available under.
	 */
	hostName: string;

	/**
	 * The path your listener is mounted under.
	 */
	pathPrefix?: string;
}

/**
 * A WebHook connection adapter that is designed to work as a middleware for a
 * connect compatible application rather than the built-in server.
 *
 * @hideProtected
 * @deprecated Use {@EventSubMiddleware} instead.
 */
@rtfm('eventsub', 'MiddlewareAdapter')
export class MiddlewareAdapter extends ConnectionAdapter {
	private readonly _hostName: string;
	private readonly _pathPrefix?: string;

	/**
	 * Creates a middleware connection adapter.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	constructor(options: MiddlewareAdapterConfig) {
		super();
		this._hostName = options.hostName;
		this._pathPrefix = options.pathPrefix;
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
