import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { Request } from 'httpanda';
import { Server } from 'httpanda';
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
	 */
	async listen(port?: number): Promise<void> {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		const server = this._adapter.createHttpServer();
		this._server = new Server({
			server,
			onError: (e, req: Request) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === 404) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method!} ${req.url!}`);
				}
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method!} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		this._server.get('/', this._createHandleHealthRequest());
		this._server.post('/:id', this._createDropLegacyRequest());
		this._server.post('/event/:id', this._createHandleRequest());
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
