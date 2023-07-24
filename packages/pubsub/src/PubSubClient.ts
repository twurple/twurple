import { createLogger, type Logger } from '@d-fischer/logger';
import { Enumerable } from '@d-fischer/shared-utils';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
import { type AuthProvider } from '@twurple/auth';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { BasicPubSubClient, type BasicPubSubClientOptions } from './BasicPubSubClient';
import { PubSubAutoModQueueMessage } from './messages/PubSubAutoModQueueMessage';
import { type PubSubAutoModQueueMessageData } from './messages/PubSubAutoModQueueMessage.external';
import { PubSubBitsBadgeUnlockMessage } from './messages/PubSubBitsBadgeUnlockMessage';
import { type PubSubBitsBadgeUnlockMessageData } from './messages/PubSubBitsBadgeUnlockMessage.external';
import { PubSubBitsMessage } from './messages/PubSubBitsMessage';
import { type PubSubBitsMessageData } from './messages/PubSubBitsMessage.external';
import { PubSubChannelRoleChangeMessage } from './messages/PubSubChannelRoleChangeMessage';
import { PubSubChannelTermsActionMessage } from './messages/PubSubChannelTermsActionMessage';
import { PubSubChatModActionMessage } from './messages/PubSubChatModActionMessage';
import { PubSubCustomMessage } from './messages/PubSubCustomMessage';
import { PubSubLowTrustUserChatMessage } from './messages/PubSubLowTrustUserChatMessage';
import { PubSubLowTrustUserTreatmentMessage } from './messages/PubSubLowTrustUserTreatmentMessage';
import {
	type PubSubLowTrustUserMessage,
	type PubSubLowTrustUserMessageData,
	type PubSubMessage,
	type PubSubMessageData,
	type PubSubModActionMessage,
	type PubSubModActionMessageData
} from './messages/PubSubMessage';
import { PubSubRedemptionMessage } from './messages/PubSubRedemptionMessage';
import { type PubSubRedemptionMessageData } from './messages/PubSubRedemptionMessage.external';
import { PubSubSubscriptionMessage } from './messages/PubSubSubscriptionMessage';
import { type PubSubSubscriptionMessageData } from './messages/PubSubSubscriptionMessage.external';
import { PubSubUnbanRequestMessage } from './messages/PubSubUnbanRequestMessage';
import { PubSubUserModerationNotificationMessage } from './messages/PubSubUserModerationNotificationMessage';
import { type PubSubUserModerationNotificationMessageData } from './messages/PubSubUserModerationNotificationMessage.external';
import { PubSubWhisperMessage } from './messages/PubSubWhisperMessage';
import { type PubSubWhisperMessageData } from './messages/PubSubWhisperMessage.external';
import { PubSubHandler } from './PubSubHandler';

/**
 * Options for the PubSub client.
 *
 * @inheritDoc
 */
export interface PubSubClientConfig extends BasicPubSubClientOptions {
	authProvider: AuthProvider;
}

/**
 * A high level PubSub client attachable to a multiple users.
 */
@rtfm('pubsub', 'PubSubClient')
export class PubSubClient extends EventEmitter {
	/** @internal */ @Enumerable(false) private readonly _authProvider: AuthProvider;
	/** @internal */ @Enumerable(false) private readonly _basicClient: BasicPubSubClient;

	private readonly _handlers = new Map<string, Array<PubSubHandler<never>>>();
	private readonly _logger: Logger;

	/**
	 * Fires when listening to a topic fails.
	 *
	 * @eventListener
	 *
	 * @param topic The name of the topic.
	 * @param error The error.
	 * @param userInitiated Whether the listen was directly initiated by a user.
	 *
	 * The other case would happen in cases like re-sending listen packets after a reconnect.
	 */
	readonly onListenError = this.registerEvent<[handler: PubSubHandler, error: Error, userInitiated: boolean]>();

	/**
	 * Creates a new PubSub client.
	 *
	 * @param config The client configuration.
	 *
	 * @expandParams
	 */
	constructor(config: PubSubClientConfig) {
		super();

		this._authProvider = config.authProvider;
		this._logger = createLogger({
			name: 'twurple:pubsub',
			...config.logger
		});
		this._basicClient = new BasicPubSubClient(config);
		this._basicClient.onMessage((topic, messageData) => {
			if (this._handlers.has(topic)) {
				const [type, , ...args] = topic.split('.');
				const message = this._parseMessage(type, args, messageData);
				if (message) {
					for (const handler of this._handlers.get(topic)!) {
						(handler as PubSubHandler).call(message);
					}
				}
			}
		});
		this._basicClient.onListenError((topic, error, userInitiated) => {
			const handlers = this._handlers.get(topic);
			if (handlers) {
				for (const handler of handlers) {
					handler.remove();
					this.emit(this.onListenError, handler, error, userInitiated);
				}
			}
		});
	}

	/**
	 * Adds a handler to AutoMod queue events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel to listen to.
	 * @param callback A function to be called when an AutoMod queue event is sent to the user.
	 *
	 * It receives a {@link PubSubAutoModQueueMessage} object.
	 */
	onAutoModQueue(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubAutoModQueueMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('automod-queue', callback, user, 'channel:moderate', extractUserId(channel));
	}

	/**
	 * Adds a handler to bits events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bits event happens in the user's channel.
	 *
	 * It receives a {@link PubSubBitsMessage} object.
	 */
	onBits(user: UserIdResolvable, callback: (message: PubSubBitsMessage) => void): PubSubHandler<never> {
		return this._addHandler('channel-bits-events-v2', callback, user, 'bits:read');
	}

	/**
	 * Adds a handler to bits badge unlock events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bit badge is unlocked in the user's channel.
	 *
	 * It receives a {@link PubSubBitsBadgeUnlockMessage} object.
	 */
	onBitsBadgeUnlock(
		user: UserIdResolvable,
		callback: (message: PubSubBitsBadgeUnlockMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('channel-bits-badge-unlocks', callback, user, 'bits:read');
	}

	/**
	 * Adds a handler to low-trust users events to the client.
	 *
	 * @param channel The channel the event will be subscribed for.
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a low-trust user event is sent to the user.
	 */
	onLowTrustUser(
		channel: UserIdResolvable,
		user: UserIdResolvable,
		callback: (message: PubSubLowTrustUserMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('low-trust-users', callback, channel, 'channel:moderate', extractUserId(user));
	}

	/**
	 * Adds a handler to mod action events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel the event will be subscribed for.
	 * @param callback A function to be called when a mod action event is sent to the user.
	 *
	 * It can receive any kind of {@link PubSubModActionMessage} object.
	 */
	onModAction(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubModActionMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('chat_moderator_actions', callback, user, 'channel:moderate', extractUserId(channel));
	}

	/**
	 * Adds a handler to redemption events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a channel point reward is redeemed in the user's channel.
	 *
	 * It receives a {@link PubSubRedemptionMessage} object.
	 */
	onRedemption(user: UserIdResolvable, callback: (message: PubSubRedemptionMessage) => void): PubSubHandler<never> {
		return this._addHandler('channel-points-channel-v1', callback, user, 'channel:read:redemptions');
	}

	/**
	 * Adds a handler to subscription events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a subscription event happens in the user's channel.
	 *
	 * It receives a {@link PubSubSubscriptionMessage} object.
	 */
	onSubscription(
		user: UserIdResolvable,
		callback: (message: PubSubSubscriptionMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('channel-subscribe-events-v1', callback, user, 'channel:read:subscriptions');
	}

	/**
	 * Adds a handler to user moderation events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel to listen to.
	 * @param callback A function to be called when a user moderation event is sent to the user.
	 *
	 * It receives a {@link PubSubUserModerationNotificationMessage} object.
	 */
	onUserModeration(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubUserModerationNotificationMessage) => void
	): PubSubHandler<never> {
		return this._addHandler('user-moderation-notifications', callback, user, 'chat:read', extractUserId(channel));
	}

	/**
	 * Adds a handler to whisper events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a whisper is sent to the user.
	 *
	 * It receives a {@link PubSubWhisperMessage} object.
	 */
	onWhisper(user: UserIdResolvable, callback: (message: PubSubWhisperMessage) => void): PubSubHandler<never> {
		return this._addHandler('whispers', callback, user, 'whispers:read');
	}

	/**
	 * Adds a handler for arbitrary/undocumented events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param topic The topic to subscribe to.
	 * @param callback A function to be called when a custom event is sent to the user.
	 *
	 * It receives a {@link PubSubCustomMessage} object.
	 * @param scope An optional scope if the topic requires it.
	 * @param channel An optional second userId if the topic requires it, usually a channel.
	 */
	onCustomTopic(
		user: UserIdResolvable,
		topic: string,
		callback: (message: PubSubCustomMessage) => void,
		scope?: string,
		channel?: UserIdResolvable
	): PubSubHandler<never> {
		if (channel) {
			return this._addHandler(topic, callback, user, scope, extractUserId(channel));
		} else {
			return this._addHandler(topic, callback, user, scope);
		}
	}

	/**
	 * Removes a handler from the client.
	 *
	 * @param handler A handler returned by one of the `on*` methods.
	 */
	removeHandler(handler: PubSubHandler<never>): void {
		if (this._handlers.has(handler.topic)) {
			const newHandlers = this._handlers.get(handler.topic)!.filter(l => l !== handler);
			if (newHandlers.length === 0) {
				this._handlers.delete(handler.topic);
				this._basicClient.unlisten(`${handler.topic}.${handler.userId}`);
				if (
					!this._basicClient.hasAnyTopics &&
					(this._basicClient.isConnected || this._basicClient.isConnecting)
				) {
					this._basicClient.disconnect();
				}
			} else {
				this._handlers.set(handler.topic, newHandlers);
			}
		}
	}

	/**
	 * Removes all handlers from the client.
	 */
	removeAllHandlers(): void {
		for (const handlers of this._handlers.values()) {
			for (const handler of handlers) {
				this.removeHandler(handler);
			}
		}
	}

	private _addHandler<T extends PubSubMessage>(
		type: string,
		callback: (message: T) => void,
		user: UserIdResolvable,
		scope?: string,
		...additionalParams: string[]
	) {
		this._basicClient.connect();
		const userId = extractUserId(user);
		const topicName = [type, userId, ...additionalParams].join('.');
		const handler = new PubSubHandler(topicName, userId, callback, this);
		if (this._handlers.has(topicName)) {
			this._handlers.get(topicName)!.push(handler);
		} else {
			this._handlers.set(topicName, [handler]);
			this._basicClient.listen(topicName, {
				type: 'provider',
				provider: this._authProvider,
				scopes: scope ? [scope] : [],
				userId
			});
		}
		return handler;
	}

	private _parseMessage(type: string, args: string[], messageData: PubSubMessageData): PubSubMessage | undefined {
		switch (type) {
			case 'automod-queue': {
				return new PubSubAutoModQueueMessage(messageData as PubSubAutoModQueueMessageData, args[0]);
			}
			case 'channel-bits-events-v2': {
				return new PubSubBitsMessage(messageData as PubSubBitsMessageData);
			}
			case 'channel-bits-badge-unlocks': {
				return new PubSubBitsBadgeUnlockMessage(messageData as PubSubBitsBadgeUnlockMessageData);
			}
			case 'channel-points-channel-v1': {
				return new PubSubRedemptionMessage(messageData as PubSubRedemptionMessageData);
			}
			case 'channel-subscribe-events-v1': {
				return new PubSubSubscriptionMessage(messageData as PubSubSubscriptionMessageData);
			}
			case 'chat_moderator_actions': {
				const data = messageData as PubSubModActionMessageData;
				switch (data.type) {
					case 'moderation_action': {
						return new PubSubChatModActionMessage(data, args[0]);
					}
					case 'channel_terms_action': {
						return new PubSubChannelTermsActionMessage(data, args[0]);
					}
					case 'approve_unban_request':
					case 'deny_unban_request': {
						return new PubSubUnbanRequestMessage(data, args[0]);
					}
					case 'moderator_added':
					case 'moderator_removed':
					case 'vip_added':
					case 'vip_removed': {
						return new PubSubChannelRoleChangeMessage(data, args[0]);
					}
					default: {
						this._logger
							.error(`Unknown moderator action received; please open an issue with the following info (redact IDs and names if you want):
Type: ${(data as PubSubModActionMessageData).type}
Data: ${JSON.stringify(data, undefined, 2)}`);
						return undefined;
					}
				}
			}
			case 'low-trust-users': {
				const data = messageData as PubSubLowTrustUserMessageData;
				switch (data.type) {
					case 'low_trust_user_new_message': {
						return new PubSubLowTrustUserChatMessage(data);
					}
					case 'low_trust_user_treatment_update': {
						return new PubSubLowTrustUserTreatmentMessage(data);
					}
					default: {
						this._logger
							.error(`Unknown low-trust users event received; please open an issue with the following info (redact IDs and names if you want):
Type: ${(data as PubSubLowTrustUserMessageData).type}
Data: ${JSON.stringify(data, undefined, 2)}`);
						return undefined;
					}
				}
			}
			case 'user-moderation-notifications': {
				return new PubSubUserModerationNotificationMessage(
					messageData as PubSubUserModerationNotificationMessageData,
					args[0]
				);
			}
			case 'whispers': {
				return new PubSubWhisperMessage(messageData as PubSubWhisperMessageData);
			}
			default:
				return new PubSubCustomMessage(messageData);
		}
	}
}
