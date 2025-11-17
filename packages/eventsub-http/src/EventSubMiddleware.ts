import { rtfm } from '@twurple/common';
import type { IRouter } from 'express-serve-static-core';
import { checkHostName } from './checks';
import { EventSubHttpBase, type EventSubHttpBaseConfig } from './EventSubHttpBase';
import { H3, toNodeHandler } from 'h3';

/**
 * The configuration of the EventSub middleware.
 *
 * @inheritDoc
 */
export interface EventSubMiddlewareConfig extends EventSubHttpBaseConfig {
	/**
	 * The host name the root application is available under.
	 */
	hostName: string;

	/**
	 * The path your listener is mounted under.
	 */
	pathPrefix?: string;

	/**
	 * Whether the path prefix will added to the mount point. Defaults to `true`.
	 *
	 * Must be `false` if you use this with subrouters.
	 */
	usePathPrefixInHandlers?: boolean;
}

/**
 * An Express middleware for the Twitch EventSub event distribution mechanism.
 *
 * You can find an extensive example on how to use this class in the [documentation](/docs/getting-data/eventsub/express).
 *
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub-http', 'EventSubMiddleware')
export class EventSubMiddleware extends EventSubHttpBase {
	private readonly _hostName: string;
	private readonly _pathPrefix?: string;
	private readonly _usePathPrefixInHandlers: boolean;

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
		this._usePathPrefixInHandlers = config.usePathPrefixInHandlers ?? true;
	}

	/**
	 * Applies middleware that handles EventSub notifications to an Express app/router.
	 *
	 * @param router The app or router the middleware should be applied to.
	 */
	apply(router: IRouter): void {
		const prefixedApp = this.getApp();
		router.use(toNodeHandler(prefixedApp));
	}

	getApp(): H3 {
		let requestPathPrefix: string | undefined = undefined;
		if (this._usePathPrefixInHandlers) {
			requestPathPrefix = this._pathPrefix;
			requestPathPrefix &&= `/${requestPathPrefix.replace(/^\/|\/$/g, '')}`;
		}

		const app = new H3()
			.use(this._isHostDenied)
			.post('/event/:id', this._createHandleRequest())
			.post('/:id', this._createDropLegacyRequest());

		if (this._helperRoutes) {
			app.get('/', this._createHandleHealthRequest());
		}

		return requestPathPrefix ? new H3().mount(requestPathPrefix, app) : app;
	}

	/**
	 * Marks the middleware as ready to receive events.
	 *
	 * The express app should be started before this.
	 */
	async markAsReady(): Promise<void> {
		await this._resumeExistingSubscriptions();
		this._readyToSubscribe = true;
	}

	protected async getHostName(): Promise<string> {
		return this._hostName;
	}

	protected async getPathPrefix(): Promise<string | undefined> {
		return this._pathPrefix;
	}
}
