import { Enumerable } from '@d-fischer/shared-utils';
import type { AuthProvider } from '@twurple/auth';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BasicPubSubClient, type BasicPubSubClientOptions } from './BasicPubSubClient';
import { PubSubAutoModQueueMessage } from './messages/PubSubAutoModQueueMessage';
import { type PubSubAutoModQueueMessageData } from './messages/PubSubAutoModQueueMessage.external';
import { PubSubBitsBadgeUnlockMessage } from './messages/PubSubBitsBadgeUnlockMessage';
import { type PubSubBitsBadgeUnlockMessageData } from './messages/PubSubBitsBadgeUnlockMessage.external';
import { PubSubBitsMessage } from './messages/PubSubBitsMessage';
import { type PubSubBitsMessageData } from './messages/PubSubBitsMessage.external';
import { PubSubChatModActionMessage } from './messages/PubSubChatModActionMessage';
import { type PubSubChatModActionMessageData } from './messages/PubSubChatModActionMessage.external';
import { PubSubCustomMessage } from './messages/PubSubCustomMessage';
import { type PubSubMessage, type PubSubMessageData } from './messages/PubSubMessage';
import { PubSubRedemptionMessage } from './messages/PubSubRedemptionMessage';
import { type PubSubRedemptionMessageData } from './messages/PubSubRedemptionMessage.external';
import { PubSubSubscriptionMessage } from './messages/PubSubSubscriptionMessage';
import { type PubSubSubscriptionMessageData } from './messages/PubSubSubscriptionMessage.external';
import { PubSubUserModerationNotificationMessage } from './messages/PubSubUserModerationNotificationMessage';
import { type PubSubUserModerationNotificationMessageData } from './messages/PubSubUserModerationNotificationMessage.external';
import { PubSubWhisperMessage } from './messages/PubSubWhisperMessage';
import { type PubSubWhisperMessageData } from './messages/PubSubWhisperMessage.external';
import { PubSubListener } from './PubSubListener';

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
export class PubSubClient {
	@Enumerable(false) private readonly _authProvider: AuthProvider;
	@Enumerable(false) private readonly _basicClient: BasicPubSubClient;

	private readonly _listeners = new Map<string, Array<PubSubListener<never>>>();

	/**
	 * Creates a new PubSub client.
	 *
	 * @param config The client configuration.
	 *
	 * @expandParams
	 */
	constructor(config: PubSubClientConfig) {
		this._authProvider = config.authProvider;
		this._basicClient = new BasicPubSubClient(config);
		this._basicClient.onMessage(async (topic, messageData) => {
			const [type, , ...args] = topic.split('.');
			if (this._listeners.has(topic)) {
				const message = PubSubClient._parseMessage(type, args, messageData);
				for (const listener of this._listeners.get(topic)!) {
					(listener as PubSubListener).call(message);
				}
			}
		});
	}

	/**
	 * Adds a listener to AutoMod queue events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel to listen to.
	 * @param callback A function to be called when an AutoMod queue event is sent to the user.
	 *
	 * It receives a {@link PubSubAutoModQueueMessage} object.
	 */
	async onAutoModQueue(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubAutoModQueueMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('automod-queue', callback, user, 'channel:moderate', extractUserId(channel));
	}

	/**
	 * Adds a listener to bits events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bits event happens in the user's channel.
	 *
	 * It receives a {@link PubSubBitsMessage} object.
	 */
	async onBits(
		user: UserIdResolvable,
		callback: (message: PubSubBitsMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('channel-bits-events-v2', callback, user, 'bits:read');
	}

	/**
	 * Adds a listener to bits badge unlock events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bit badge is unlocked in the user's channel.
	 *
	 * It receives a {@link PubSubBitsBadgeUnlockMessage} object.
	 */
	async onBitsBadgeUnlock(
		user: UserIdResolvable,
		callback: (message: PubSubBitsBadgeUnlockMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('channel-bits-badge-unlocks', callback, user, 'bits:read');
	}

	/**
	 * Adds a listener to mod action events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel the event will be subscribed for.
	 * @param callback A function to be called when a mod action event is sent to the user.
	 *
	 * It receives a {@link PubSubChatModActionMessage} object.
	 */
	async onModAction(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubChatModActionMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener(
			'chat_moderator_actions',
			callback,
			user,
			'channel:moderate',
			extractUserId(channel)
		);
	}

	/**
	 * Adds a listener to redemption events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a channel point reward is redeemed in the user's channel.
	 *
	 * It receives a {@link PubSubRedemptionMessage} object.
	 */
	async onRedemption(
		user: UserIdResolvable,
		callback: (message: PubSubRedemptionMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('channel-points-channel-v1', callback, user, 'channel:read:redemptions');
	}

	/**
	 * Adds a listener to subscription events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a subscription event happens in the user's channel.
	 *
	 * It receives a {@link PubSubSubscriptionMessage} object.
	 */
	async onSubscription(
		user: UserIdResolvable,
		callback: (message: PubSubSubscriptionMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('channel-subscribe-events-v1', callback, user, 'channel:read:subscriptions');
	}

	/**
	 * Adds a listener to user moderation events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel to listen to.
	 * @param callback A function to be called when a user moderation event is sent to the user.
	 *
	 * It receives a {@link PubSubUserModerationNotificationMessage} object.
	 */
	async onUserModeration(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubSubscriptionMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener(
			'user-moderation-notifications',
			callback,
			user,
			'chat:read',
			extractUserId(channel)
		);
	}

	/**
	 * Adds a listener to whisper events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a whisper is sent to the user.
	 *
	 * It receives a {@link PubSubWhisperMessage} object.
	 */
	async onWhisper(
		user: UserIdResolvable,
		callback: (message: PubSubWhisperMessage) => void
	): Promise<PubSubListener<never>> {
		return await this._addListener('whispers', callback, user, 'whispers:read');
	}

	/**
	 * Adds a listener for arbitrary/undocumented events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param topic The topic to subscribe to.
	 * @param callback A function to be called when a custom event is sent to the user.
	 *
	 * It receives a {@link PubSubCustomMessage} object.
	 * @param scope An optional scope if the topic requires it.
	 * @param channel An optional second userId if the topic requires it, usually a channel.
	 */
	async onCustomTopic(
		user: UserIdResolvable,
		topic: string,
		callback: (message: PubSubCustomMessage) => void,
		scope?: string,
		channel?: UserIdResolvable
	): Promise<PubSubListener<never>> {
		if (channel) {
			return await this._addListener(topic, callback, user, scope, extractUserId(channel));
		} else {
			return await this._addListener(topic, callback, user, scope);
		}
	}

	/**
	 * Removes a listener from the client.
	 *
	 * @param listener A listener returned by one of the `add*Listener` methods.
	 */
	async removeListener(listener: PubSubListener<never>): Promise<void> {
		if (this._listeners.has(listener.topic)) {
			const newListeners = this._listeners.get(listener.topic)!.filter(l => l !== listener);
			if (newListeners.length === 0) {
				this._listeners.delete(listener.topic);
				await this._basicClient.unlisten(`${listener.topic}.${listener.userId}`);
				if (
					!this._basicClient.hasAnyTopics &&
					(this._basicClient.isConnected || this._basicClient.isConnecting)
				) {
					await this._basicClient.disconnect();
				}
			} else {
				this._listeners.set(listener.topic, newListeners);
			}
		}
	}

	/**
	 * Removes all listeners from the client.
	 */
	async removeAllListeners(): Promise<void> {
		for (const listeners of this._listeners.values()) {
			for (const listener of listeners) {
				await this.removeListener(listener);
			}
		}
	}

	private async _addListener<T extends PubSubMessage>(
		type: string,
		callback: (message: T) => void,
		user: UserIdResolvable,
		scope?: string,
		...additionalParams: string[]
	) {
		await this._basicClient.connect();
		const userId = extractUserId(user);
		const topicName = [type, userId, ...additionalParams].join('.');
		const listener = new PubSubListener(topicName, userId, callback, this);
		if (this._listeners.has(topicName)) {
			this._listeners.get(topicName)!.push(listener);
		} else {
			this._listeners.set(topicName, [listener]);
			await this._basicClient.listen(topicName, {
				type: 'provider',
				provider: this._authProvider,
				scopes: scope ? [scope] : [],
				userId
			});
		}
		return listener;
	}

	private static _parseMessage(type: string, args: string[], messageData: PubSubMessageData): PubSubMessage {
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
				return new PubSubChatModActionMessage(messageData as PubSubChatModActionMessageData, args[0]);
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
