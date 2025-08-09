import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import { type EventSubListener } from '@twurple/eventsub-base';
import { type ConnectionAdapter } from './adapters/ConnectionAdapter';
import { EventSubHttpBase, type EventSubHttpBaseConfig } from './EventSubHttpBase';
import { H3, onError, onResponse } from 'h3';
import { type Server } from 'srvx';

/**
 * Certificate data used to make the listener server SSL capable.
 */
export interface EventSubHttpListenerCertificateConfig {
	/**
	 * The private key of your SSL certificate.
	 */
	key: string;

	/**
	 * Your full SSL certificate chain, including all intermediate certificates.
	 */
	cert: string;
}

/**
 * Configuration for an EventSub HTTP listener.
 *
 * @inheritDoc
 */
export interface EventSubHttpListenerConfig extends EventSubHttpBaseConfig {
	/**
	 * The connection adapter responsible for the configuration of the connection method.
	 */
	adapter: ConnectionAdapter;
}

/**
 * An HTTP listener for the Twitch EventSub event distribution mechanism.
 *
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub-http', 'EventSubHttpListener')
export class EventSubHttpListener extends EventSubHttpBase implements EventSubListener {
	/** @internal */ @Enumerable(false) private _server?: Server;
	/** @internal */ private readonly _adapter: ConnectionAdapter;

	/**
	 * Creates a new EventSub HTTP listener.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubHttpListenerConfig) {
		super(config);
		this._adapter = config.adapter;
	}

	/**
	 * Starts the HTTP listener.
	 */
	start(): void {
		if (this._server) {
			throw new Error('Trying to start while already running');
		}
		const app = new H3()
			.use(this._isHostDenied)
			.use(
				onError((error, event) => {
					if (error.status === 404) {
						this._logger.warn(
							`Access to unknown URL/method attempted: ${event.req.method} ${event.url.pathname}`,
						);
					}
				}),
			)
			.use(
				onResponse((response, event) =>
					this._logger.debug(`${event.req.method} ${event.url.pathname} - ${response.status}`),
				),
			)
			.post('/event/:id', this._createHandleRequest())
			.post('/:id', this._createDropLegacyRequest());

		if (this._helperRoutes) {
			app.get('/', this._createHandleHealthRequest());
		}

		let requestPathPrefix: string | undefined = undefined;
		if (this._adapter.usePathPrefixInHandlers) {
			requestPathPrefix = this._adapter.pathPrefix;
			requestPathPrefix &&= `/${requestPathPrefix.replace(/^\/|\/$/g, '')}`;
		}

		const prefixedApp = requestPathPrefix ? new H3().mount(requestPathPrefix, app) : app;

		const adapterListenerPort = this._adapter.listenerPort;
		const listenerPort = adapterListenerPort ?? 443;

		this._server = this._adapter.createHttpServer(prefixedApp, listenerPort);
		this._server
			.ready()
			.then(async () => {
				this._logger.info(`Listening on port ${listenerPort}`);
				await this._resumeExistingSubscriptions();
				this._readyToSubscribe = true;
			})
			.catch(e => {
				this._logger.crit(`Could not listen on port ${listenerPort}: ${(e as Error).message}`);
			});
	}

	/**
	 * Stops the HTTP listener.
	 */
	stop(): void {
		if (!this._server) {
			throw new Error('Trying to stop while not running');
		}

		for (const sub of this._subscriptions.values()) {
			sub.suspend();
		}

		this._server.close().then(
			() => {
				this._server = undefined;
				this._readyToSubscribe = false;
			},
			e => this._logger.crit(`Could not stop listener: ${(e as Error).message}`),
		);
	}

	protected async getHostName(): Promise<string> {
		return await this._adapter.getHostName();
	}

	protected async getPathPrefix(): Promise<string | undefined> {
		return this._adapter.pathPrefix;
	}
}
