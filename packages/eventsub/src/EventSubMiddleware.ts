import { rtfm } from '@twurple/common';
import type { Express, RequestHandler } from 'express-serve-static-core';
import { checkHostName } from './checks';
import type { EventSubBaseConfig } from './EventSubBase';
import { EventSubBase } from './EventSubBase';

/**
 * The configuration of the EventSub middleware.
 *
 * @inheritDoc
 */
export interface EventSubMiddlewareConfig extends EventSubBaseConfig {
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
 * A connect-compatible middleware for the Twitch EventSub event distribution mechanism.
 *
 * ## Example
 * ```ts twoslash
 * // @module: esnext
 * // @target: ES2017
 * // @lib: es2015,dom
 * import type { ApiClient } from '@twurple/api';
 * import { EventSubMiddleware } from '@twurple/eventsub';
 * declare const app: any;
 * declare const apiClient: ApiClient;
 * // ---cut---
 * const middleware = new EventSubMiddleware({
 *   apiClient,
 *   hostName: 'example.com',
 *   pathPrefix: '/twitch',
 *   secret: 'secretHere'
 * });
 *
 * await middleware.apply(app);
 * app.listen(3000, async () => {
 *   await middleware.markAsReady();
 *   await middleware.subscribeToChannelFollowEvents('125328655', event => {
 *     console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
 *   });
 * });
 * ```
 *
 * @hideProtected
 * @inheritDoc
 */
@rtfm('eventsub', 'EventSubMiddleware')
export class EventSubMiddleware extends EventSubBase {
	private readonly _hostName: string;
	private readonly _pathPrefix?: string;

	/**
	 * Creates a new EventSub middleware wrapper.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubMiddlewareConfig) {
		super(config);

		checkHostName(config.hostName);

		this._hostName = config.hostName;
		this._pathPrefix = config.pathPrefix;
	}

	/**
	 * Applies middleware that handles EventSub notifications to a connect-compatible app (like express).
	 *
	 * @param app The app the middleware should be applied to.
	 */
	async apply(app: Express): Promise<void> {
		let pathPrefix = this._pathPrefix;
		if (pathPrefix) {
			pathPrefix = `/${pathPrefix.replace(/^\/|\/$/g, '')}`;
		}
		const requestHandler = this._createHandleRequest() as unknown as RequestHandler;
		const dropLegacyHandler = this._createDropLegacyRequest() as unknown as RequestHandler;
		const healthHandler = this._createHandleHealthRequest() as unknown as RequestHandler;
		if (pathPrefix) {
			app.post(`${pathPrefix}/event/:id`, requestHandler);
			app.post(`${pathPrefix}/:id`, dropLegacyHandler);
			app.get(`${pathPrefix}`, healthHandler);
		} else {
			app.post('event/:id', requestHandler);
			app.post(':id', dropLegacyHandler);
			app.get('/', healthHandler);
		}
	}

	/**
	 * Marks the middleware as ready to receive events.
	 *
	 * The express app should be started before this.
	 */
	async markAsReady(): Promise<void> {
		this._readyToSubscribe = true;
		await this._resumeExistingSubscriptions();
	}

	protected async getHostName(): Promise<string> {
		return this._hostName;
	}

	protected async getPathPrefix(): Promise<string | undefined> {
		return this._pathPrefix;
	}
}
