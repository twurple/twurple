import Logger, { LoggerOptions } from '@d-fischer/logger';
import { getPortPromise } from '@d-fischer/portfinder';
import { v4 } from '@d-fischer/public-ip';
import getRawBody from '@d-fischer/raw-body';
import { Request, Response, Server } from 'httpanda';
import * as https from 'https';
import TwitchClient, {
	extractUserId,
	HelixBanEvent,
	HelixExtensionTransaction,
	HelixFollow,
	HelixModeratorEvent,
	HelixStream,
	HelixSubscriptionEvent,
	HelixUser,
	UserIdResolvable
} from 'twitch';
import BanEventSubscription from './Subscriptions/BanEventSubscription';
import ExtensionTransactionSubscription from './Subscriptions/ExtensionTransactionSubscription';
import FollowsFromUserSubscription from './Subscriptions/FollowsFromUserSubscription';
import FollowsToUserSubscription from './Subscriptions/FollowsToUserSubscription';
import ModeratorEventSubscription from './Subscriptions/ModeratorEventSubscription';
import StreamChangeSubscription from './Subscriptions/StreamChangeSubscription';
import Subscription from './Subscriptions/Subscription';
import SubscriptionEventSubscription from './Subscriptions/SubscriptionEventSubscription';
import UserChangeSubscription from './Subscriptions/UserChangeSubscription';

interface WebHookListenerCertificateConfig {
	key: string;
	cert: string;
}

interface WebHookListenerReverseProxyConfig {
	port?: number;
	ssl?: boolean;
	pathPrefix?: string;
}

interface WebHookListenerConfig {
	hostName?: string;
	port?: number;
	ssl?: WebHookListenerCertificateConfig;
	reverseProxy?: WebHookListenerReverseProxyConfig;
	hookValidity?: number;
	logger?: Partial<LoggerOptions>;
}

interface WebHookListenerComputedConfig {
	hostName: string;
	port: number;
	ssl?: WebHookListenerCertificateConfig;
	reverseProxy: Required<WebHookListenerReverseProxyConfig>;
	hookValidity?: number;
	logger: LoggerOptions;
}

export default class WebHookListener {
	private _server?: Server;
	private readonly _subscriptions = new Map<string, Subscription>();
	private readonly _logger: Logger;

	static async create(client: TwitchClient, config: WebHookListenerConfig = {}) {
		const listenerPort = config.port || (await getPortPromise());
		const reverseProxy = config.reverseProxy || {};
		return new WebHookListener(
			{
				hostName: config.hostName || (await v4()),
				port: listenerPort,
				ssl: config.ssl,
				reverseProxy: {
					port: reverseProxy.port || listenerPort,
					ssl: reverseProxy.ssl === undefined ? !!config.ssl : reverseProxy.ssl,
					pathPrefix: reverseProxy.pathPrefix || ''
				},
				hookValidity: config.hookValidity,
				logger: {
					name: 'twitch-webhooks',
					emoji: true,
					...(config.logger ?? {})
				}
			},
			client
		);
	}

	private constructor(
		private readonly _config: WebHookListenerComputedConfig,
		/** @private */ public readonly _twitchClient: TwitchClient
	) {
		this._logger = new Logger(_config.logger);
	}

	async listen() {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		let server: https.Server | undefined;
		if (this._config.ssl) {
			server = https.createServer({
				key: this._config.ssl.key,
				cert: this._config.ssl.cert
			});
		}
		this._server = new Server({
			server,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onError: (e, req: Request) => {
				if (e.code === 404) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method} ${req.url}`);
				}
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		this._server.get('/:id', (req, res, next) => {
			this._handleVerification(req, res);
			next();
		});
		this._server.post('/:id', async (req, res, next) => {
			await this._handleNotification(req, res);
			next();
		});
		await this._server.listen(this._config.port);
		this._logger.info(`Listening on port ${this._config.port}`);

		await Promise.all([...this._subscriptions.values()].map(async sub => sub.start()));
	}

	async unlisten() {
		if (!this._server) {
			throw new Error('Trying to unlisten while not listening');
		}

		await this._server.close();
		this._server = undefined;

		await Promise.all([...this._subscriptions.values()].map(async sub => sub.stop()));
	}

	async subscribeToUserChanges(
		user: UserIdResolvable,
		handler: (user: HelixUser) => void,
		withEmail: boolean = false,
		validityInSeconds = this._config.hookValidity
	) {
		const userId = extractUserId(user);

		const subscription = new UserChangeSubscription(userId, handler, withEmail, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToFollowsToUser(
		user: UserIdResolvable,
		handler: (follow: HelixFollow) => void,
		validityInSeconds = this._config.hookValidity
	) {
		const userId = extractUserId(user);

		const subscription = new FollowsToUserSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToFollowsFromUser(
		user: UserIdResolvable,
		handler: (follow: HelixFollow) => void,
		validityInSeconds = this._config.hookValidity
	) {
		const userId = extractUserId(user);

		const subscription = new FollowsFromUserSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToStreamChanges(
		user: UserIdResolvable,
		handler: (stream?: HelixStream) => void,
		validityInSeconds = this._config.hookValidity
	) {
		const userId = extractUserId(user);

		const subscription = new StreamChangeSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToSubscriptionEvents(
		user: UserIdResolvable,
		handler: (subscriptionEvent: HelixSubscriptionEvent) => void,
		validityInSeconds = this._config.hookValidity
	) {
		const userId = extractUserId(user);

		const subscription = new SubscriptionEventSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToBanEvents(
		broadcaster: UserIdResolvable,
		handler: (banEvent: HelixBanEvent) => void,
		user?: UserIdResolvable,
		validityInSeconds = this._config.hookValidity
	) {
		const broadcasterId = extractUserId(broadcaster);
		const userId = user ? extractUserId(user) : undefined;

		const subscription = new BanEventSubscription(broadcasterId, handler, this, userId, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToModeratorEvents(
		broadcaster: UserIdResolvable,
		handler: (modEvent: HelixModeratorEvent) => void,
		user?: UserIdResolvable,
		validityInSeconds = this._config.hookValidity
	) {
		const broadcasterId = extractUserId(broadcaster);
		const userId = user ? extractUserId(user) : undefined;

		const subscription = new ModeratorEventSubscription(broadcasterId, handler, this, userId, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	async subscribeToExtensionTransactions(
		extensionId: string,
		handler: (transaction: HelixExtensionTransaction) => void,
		validityInSeconds = this._config.hookValidity
	) {
		const subscription = new ExtensionTransactionSubscription(extensionId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/** @private */
	_buildHookUrl(id: string) {
		const protocol = this._config.reverseProxy.ssl ? 'https' : 'http';

		let hostName = this._config.hostName;

		if (this._config.reverseProxy.port !== (this._config.reverseProxy.ssl ? 443 : 80)) {
			hostName += `:${this._config.reverseProxy.port}`;
		}

		// trim slashes on both ends
		const pathPrefix = this._config.reverseProxy.pathPrefix.replace(/^\/|\/$/, '');

		return `${protocol}://${hostName}${pathPrefix ? '/' : ''}${pathPrefix}/${id}`;
	}

	/** @private */
	_changeIdOfSubscription(oldId: string, newId: string) {
		const sub = this._subscriptions.get(oldId);
		if (sub) {
			this._subscriptions.delete(oldId);
			this._subscriptions.set(newId, sub);
		}
	}

	/** @private */
	_dropSubscription(id: string) {
		this._subscriptions.delete(id);
	}

	private _handleVerification(req: Request, res: Response) {
		const { id } = req.params;
		const subscription = this._subscriptions.get(id);
		if (subscription) {
			const hubMode = req.query?.['hub.mode'];
			if (hubMode === 'subscribe') {
				subscription._verify();
				res.writeHead(202);
				res.end(req.query['hub.challenge']);
				this._logger.debug(`Successfully subscribed to hook: ${id}`);
			} else if (hubMode === 'unsubscribe') {
				this._subscriptions.delete(id);
				res.writeHead(200);
				res.end();
				this._logger.debug(`Successfully unsubscribed from hook: ${id}`);
			} else if (hubMode === 'denied') {
				this._logger.error(`Subscription denied to hook: ${id} (${req.query['hub.reason']})`);
				res.writeHead(200);
				res.end();
			} else {
				this._logger.warn(`Unknown hub.mode ${hubMode} for hook: ${id}`);
				res.writeHead(400);
				res.end();
			}
		} else {
			this._logger.warn(`Verification of unknown hook attempted: ${id}`);
			res.writeHead(410);
			res.end();
		}
	}

	private async _handleNotification(req: Request, res: Response) {
		const body = await getRawBody(req, true);
		const { id } = req.params;
		const subscription = this._subscriptions.get(id);
		if (subscription) {
			res.writeHead(202);
			res.end();
			if (subscription._handleData(body, req.headers['x-hub-signature']! as string)) {
				this._logger.debug(`Successfully verified notification signature for hook: ${id}`);
			} else {
				this._logger.warn(
					`Failed to verify notification signature for hook: ${id}. ` +
						'This might be caused by Twitch still sending notifications with an old secret and is perfectly normal a few times after you just restarted the script.\n' +
						'If the problem persists over a long period of time, please file an issue.'
				);
			}
		} else {
			this._logger.warn(`Notification for unknown hook received: ${id}`);
			res.writeHead(410);
			res.end();
		}
	}
}
