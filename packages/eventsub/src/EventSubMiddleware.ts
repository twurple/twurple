import type { ApiClient } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { RequestHandler } from 'httpanda';
import type { ConnectCompatibleApp, ConnectCompatibleMiddleware } from './ConnectCompatibleApp';
import { EventSubBase } from './EventSubBase';
import type { EventSubConfig } from './EventSubListener';

/**
 * The configuration of the EventSub middleware.
 *
 * @inheritDoc
 */
export interface EventSubMiddlewareConfig extends EventSubConfig {
	/**
	 * The host name the root application is available under.
	 */
	hostName: string;

	/**
	 * The path your listener is mounted under.
	 */
	pathPrefix?: string;

	/**
	 * Your EventSub secret.
	 *
	 * This should be a randomly generated string, but it should be the same between restarts.
	 *
	 * WARNING: Please do not use your application's client secret!
	 */
	secret: string;
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
 * const middleware = new EventSubMiddleware(apiClient, {
 *   hostName: 'example.com',
 *   pathPrefix: '/twitch',
 *   secret: 'secretHere'
 * });
 
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
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(apiClient: ApiClient, config: EventSubMiddlewareConfig) {
		super(apiClient, config.secret, config);

		this._hostName = config.hostName;
		this._pathPrefix = config.pathPrefix;
	}

	/**
	 * Applies middleware that handles EventSub notifications to a connect-compatible app (like express).
	 *
	 * @param app The app the middleware should be applied to.
	 */
	async apply(app: ConnectCompatibleApp): Promise<void> {
		let pathPrefix = this._pathPrefix;
		if (pathPrefix) {
			pathPrefix = `/${pathPrefix.replace(/^\/|\/$/, '')}`;
		}
		const paramParser: RequestHandler = (req, res, next) => {
			const [, id] = req.path.split('/');
			req.param = req.params = { id };
			next();
		};
		const requestHandler = this._createHandleRequest();
		if (pathPrefix) {
			app.use(
				pathPrefix,
				paramParser as ConnectCompatibleMiddleware,
				requestHandler as ConnectCompatibleMiddleware
			);
		} else {
			app.use(paramParser as ConnectCompatibleMiddleware, requestHandler as ConnectCompatibleMiddleware);
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
