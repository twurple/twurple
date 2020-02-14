import * as https from 'https';
import { PolkaRequest, PolkaResponse } from 'polka';
import * as portFinder from 'portfinder';
import * as publicIp from 'public-ip';
import * as getRawBody from 'raw-body';
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

// eslint-disable-next-line @typescript-eslint/no-require-imports
import polka = require('polka');

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
}

interface WebHookListenerComputedConfig {
	hostName: string;
	port: number;
	ssl?: WebHookListenerCertificateConfig;
	reverseProxy: Required<WebHookListenerReverseProxyConfig>;
	hookValidity?: number;
}

export default class WebHookListener {
	private _server?: polka.Polka;
	private readonly _subscriptions = new Map<string, Subscription>();

	static async create(client: TwitchClient, config: WebHookListenerConfig = {}) {
		const listenerPort = config.port || (await portFinder.getPortPromise());
		const reverseProxy = config.reverseProxy || {};
		return new WebHookListener(
			{
				hostName: config.hostName || (await publicIp.v4()),
				port: listenerPort,
				ssl: config.ssl,
				reverseProxy: {
					port: reverseProxy.port || listenerPort,
					ssl: reverseProxy.ssl === undefined ? !!config.ssl : reverseProxy.ssl,
					pathPrefix: reverseProxy.pathPrefix || ''
				},
				hookValidity: config.hookValidity
			},
			client
		);
	}

	private constructor(
		private readonly _config: WebHookListenerComputedConfig,
		/** @private */ public readonly _twitchClient: TwitchClient
	) {}

	listen() {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		if (this._config.ssl) {
			const server = https.createServer({
				key: this._config.ssl.key,
				cert: this._config.ssl.cert
			});
			this._server = polka({ server });
		} else {
			this._server = polka();
		}
		this._server.add('GET', '/:id', (req, res) => {
			this._handleVerification(req, res);
		});
		// tslint:disable-next-line:no-floating-promises
		this._server.add('POST', '/:id', (req, res) => {
			this._handleNotification(req, res);
		});
		this._server.listen(this._config.port);

		for (const sub of [...this._subscriptions.values()]) {
			// tslint:disable-next-line:no-floating-promises
			sub.start();
		}
	}

	unlisten() {
		if (!this._server) {
			throw new Error('Trying to unlisten while not listening');
		}

		this._server.server.close();
		this._server = undefined;

		for (const sub of [...this._subscriptions.values()]) {
			// tslint:disable-next-line:no-floating-promises
			sub.stop();
		}
	}

	buildHookUrl(id: string) {
		const protocol = this._config.reverseProxy.ssl ? 'https' : 'http';

		let hostName = this._config.hostName;

		if (this._config.reverseProxy.port !== (this._config.reverseProxy.ssl ? 443 : 80)) {
			hostName += `:${this._config.reverseProxy.port}`;
		}

		// trim slashes on both ends
		const pathPrefix = this._config.reverseProxy.pathPrefix.replace(/^\/|\/$/, '');

		return `${protocol}://${hostName}${pathPrefix ? '/' : ''}${pathPrefix}/${id}`;
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

	private _handleVerification(req: PolkaRequest, res: PolkaResponse) {
		const subscription = this._subscriptions.get(req.params.id);
		if (subscription) {
			if (req.query['hub.mode'] === 'subscribe') {
				subscription._verify();
				res.writeHead(202);
				res.end(req.query['hub.challenge']);
			} else {
				this._subscriptions.delete(req.params.id);
				res.writeHead(200);
				res.end();
			}
		} else {
			res.writeHead(410);
			res.end();
		}
	}

	private async _handleNotification(req: PolkaRequest, res: PolkaResponse) {
		const body = await getRawBody(req, true);
		const subscription = this._subscriptions.get(req.params.id);
		if (subscription) {
			res.writeHead(202);
			res.end();
			subscription._handleData(body, req.headers['x-hub-signature']! as string);
		} else {
			res.writeHead(410);
			res.end();
		}
	}
}
