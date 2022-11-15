import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { NextFunction, Request, Response } from 'httpanda';
import { defaultOnError, Server } from 'httpanda';
import type { ConnectionAdapter } from './adapters/ConnectionAdapter';
import type { EventSubBaseConfig } from './EventSubBase';
import { EventSubBase } from './EventSubBase';

/**
 * Certificate data used to make the listener server SSL capable.
 */
export interface EventSubListenerCertificateConfig {
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
 * Configuration for an EventSub listener.
 *
 * @inheritDoc
 */
export interface EventSubListenerConfig extends EventSubBaseConfig {
	/**
	 * The connection adapter responsible for the configuration of the connection method.
	 */
	adapter: ConnectionAdapter;
}

/**
 * A listener for the Twitch EventSub event distribution mechanism.
 *
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub', 'EventSubListener')
export class EventSubListener extends EventSubBase {
	@Enumerable(false) private _server?: Server;
	private readonly _adapter: ConnectionAdapter;

	/**
	 * Creates a new EventSub listener.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubListenerConfig) {
		super(config);
		this._adapter = config.adapter;
	}

	/**
	 * Starts the backing server and listens to incoming EventSub notifications.
	 *
	 * @param port The port to listen on. Might be overridden by the adapter you passed.
	 *
	 * Defaults to 443.
	 */
	async listen(port?: number): Promise<void> {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		const server = this._adapter.createHttpServer();
		this._server = new Server({
			server,
			onError: async (e, req: Request, res: Response, next: NextFunction) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === 404 && !(await this._isHostDenied(req))) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method!} ${req.url!}`);
				}
				defaultOnError(e, req, res, next);
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method!} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		let requestPathPrefix: string | undefined = undefined;
		if (this._adapter.usePathPrefixInHandlers) {
			requestPathPrefix = this._adapter.pathPrefix;
			if (requestPathPrefix) {
				requestPathPrefix = `/${requestPathPrefix.replace(/^\/|\/$/g, '')}`;
			}
		}

		const healthHandler = this._createHandleHealthRequest();
		const dropLegacyHandler = this._createDropLegacyRequest();
		const requestHandler = this._createHandleRequest();

		if (requestPathPrefix) {
			this._server.post(`${requestPathPrefix}/event/:id`, requestHandler);
			this._server.post(`${requestPathPrefix}/:id`, dropLegacyHandler);
			this._server.get(`${requestPathPrefix}`, healthHandler);
		} else {
			this._server.post('/event/:id', requestHandler);
			this._server.post('/:id', dropLegacyHandler);
			this._server.get('/', healthHandler);
		}

		const adapterListenerPort = await this._adapter.getListenerPort();
		if (adapterListenerPort && port) {
			this._logger.warn(`Your passed port (${port}) is being ignored because the adapter has overridden it.
Listening on port ${adapterListenerPort} instead.`);
		}
		const listenerPort = adapterListenerPort ?? port ?? 443;
		await this._server.listen(listenerPort);
		this._readyToSubscribe = true;
		this._logger.info(`Listening on port ${listenerPort}`);
		await this._resumeExistingSubscriptions();
	}

	/**
	 * Stops the backing server, suspending all active subscriptions.
	 */
	async unlisten(): Promise<void> {
		if (!this._server) {
			throw new Error('Trying to unlisten while not listening');
		}

		await Promise.all([...this._subscriptions.values()].map(async sub => await sub.suspend()));

		await this._server.close();
		this._server = undefined;
		this._readyToSubscribe = false;
	}

	protected async getHostName(): Promise<string> {
		return await this._adapter.getHostName();
	}

	protected async getPathPrefix(): Promise<string | undefined> {
		return this._adapter.pathPrefix;
	}
}
