import type { LoggerOptions } from '@d-fischer/logger';
import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from 'twitch';
import { getValidTokenFromProvider } from 'twitch-auth';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BasicPubSubClient } from './BasicPubSubClient';
import type { PubSubBitsBadgeUnlockMessageData } from './Messages/PubSubBitsBadgeUnlockMessage';
import { PubSubBitsBadgeUnlockMessage } from './Messages/PubSubBitsBadgeUnlockMessage';
import type { PubSubBitsMessageData } from './Messages/PubSubBitsMessage';
import { PubSubBitsMessage } from './Messages/PubSubBitsMessage';
import type { PubSubChatModActionMessageData } from './Messages/PubSubChatModActionMessage';
import { PubSubChatModActionMessage } from './Messages/PubSubChatModActionMessage';
import type { PubSubMessage, PubSubMessageData } from './Messages/PubSubMessage';
import type { PubSubRedemptionMessageData } from './Messages/PubSubRedemptionMessage';
import { PubSubRedemptionMessage } from './Messages/PubSubRedemptionMessage';
import type { PubSubSubscriptionMessageData } from './Messages/PubSubSubscriptionMessage';
import { PubSubSubscriptionMessage } from './Messages/PubSubSubscriptionMessage';
import type { PubSubWhisperMessageData } from './Messages/PubSubWhisperMessage';
import { PubSubWhisperMessage } from './Messages/PubSubWhisperMessage';
import { PubSubListener } from './PubSubListener';

/**
 * Options for creating the single-user PubSub client.
 */
interface SingleUserPubSubClientOptions {
	/**
	 * The {@AuthProvider} instance to use for token management.
	 */
	authProvider: AuthProvider;

	/**
	 * The underlying {@BasicPubSubClient} instance. If not given, we'll create a new one.
	 *
	 * **WARNING:** If you pass this, you shouldn't execute any manual actions on it.
	 * You can, however, pass the same client to multiple instances of {@SingleUserPubSubClient}.
	 */
	pubSubClient?: BasicPubSubClient;

	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

/**
 * A higher level PubSub client attached to a single user.
 */
@rtfm('twitch-pubsub-client', 'SingleUserPubSubClient')
export class SingleUserPubSubClient {
	@Enumerable(false) private readonly _authProvider: AuthProvider;
	@Enumerable(false) private readonly _pubSubClient: BasicPubSubClient;

	private readonly _listeners = new Map<string, Array<PubSubListener<never>>>();

	private _userId?: string;

	/**
	 * Creates a new Twitch PubSub client.
	 *
	 * @expandParams
	 */
	constructor({ authProvider, pubSubClient, logger }: SingleUserPubSubClientOptions) {
		this._authProvider = authProvider;
		this._pubSubClient = pubSubClient ?? new BasicPubSubClient({ logger });
		this._pubSubClient.onMessage(async (topic, messageData) => {
			const [type, userId, ...args] = topic.split('.');
			if (this._listeners.has(topic) && userId === (await this._getUserId())) {
				const message = SingleUserPubSubClient._parseMessage(type, args, messageData);
				if (message) {
					for (const listener of this._listeners.get(topic)!) {
						(listener as PubSubListener).call(message);
					}
				}
			}
		});
	}

	/**
	 * Adds a listener to bits events to the client.
	 *
	 * @param callback A function to be called when a bits event happens in the user's channel.
	 *
	 * It receives a {@PubSubBitsMessage} object.
	 */
	async onBits(callback: (message: PubSubBitsMessage) => void): Promise<PubSubListener<never>> {
		return this._addListener('channel-bits-events-v2', callback, 'bits:read');
	}

	/**
	 * Adds a listener to bits badge unlock events to the client.
	 *
	 * @param callback A function to be called when a bit badge is unlocked in the user's channel.
	 *
	 * It receives a {@PubSubBitsBadgeUnlockMessage} object.
	 */
	async onBitsBadgeUnlock(callback: (message: PubSubBitsBadgeUnlockMessage) => void): Promise<PubSubListener<never>> {
		return this._addListener('channel-bits-badge-unlocks', callback, 'bits:read');
	}

	/**
	 * Adds a listener to redemption events to the client.
	 *
	 * @param callback A function to be called when a channel point reward is redeemed in the user's channel.
	 *
	 * It receives a {@PubSubRedemptionMessage} object.
	 */
	async onRedemption(callback: (message: PubSubRedemptionMessage) => void): Promise<PubSubListener<never>> {
		return this._addListener('channel-points-channel-v1', callback, 'channel:read:redemptions');
	}

	/**
	 * Adds a listener to subscription events to the client.
	 *
	 * @param callback A function to be called when a subscription event happens in the user's channel.
	 *
	 * It receives a {@PubSubSubscriptionMessage} object.
	 */
	async onSubscription(callback: (message: PubSubSubscriptionMessage) => void): Promise<PubSubListener<never>> {
		return this._addListener('channel-subscribe-events-v1', callback, 'channel_subscriptions');
	}

	/**
	 * Adds a listener to whisper events to the client.
	 *
	 * @param callback A function to be called when a whisper is sent to the user.
	 *
	 * It receives a {@PubSubWhisperMessage} object.
	 */
	async onWhisper(callback: (message: PubSubWhisperMessage) => void): Promise<PubSubListener<never>> {
		return this._addListener('whispers', callback, 'whispers:read');
	}

	/**
	 * Adds a listener to mod action events to the client.
	 *
	 * @param channelId The ID of the channel to listen to.
	 * @param callback A function to be called when a mod action event is sent to the user.
	 *
	 * It receives a {@PubSubChatModActionMessage} object.
	 */
	async onModAction(
		channelId: UserIdResolvable,
		callback: (message: PubSubChatModActionMessage) => void
	): Promise<PubSubListener<never>> {
		return this._addListener('chat_moderator_actions', callback, 'channel:moderate', extractUserId(channelId));
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
				await this._pubSubClient.unlisten(`${listener.topic}.${listener.userId}`);
				if (
					!this._pubSubClient.hasAnyTopics &&
					(this._pubSubClient.isConnected || this._pubSubClient.isConnecting)
				) {
					await this._pubSubClient.disconnect();
				}
			} else {
				this._listeners.set(listener.topic, newListeners);
			}
		}
	}

	private static _parseMessage(
		type: string,
		args: string[],
		messageData: PubSubMessageData
	): PubSubMessage | undefined {
		switch (type) {
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
			case 'whispers': {
				return new PubSubWhisperMessage(messageData as PubSubWhisperMessageData);
			}
			default:
				return undefined;
		}
	}

	private async _getUserId(): Promise<string> {
		if (this._userId) {
			return this._userId;
		}

		const { tokenInfo } = await getValidTokenFromProvider(this._apiClient);

		return (this._userId = tokenInfo.userId);
	}

	private async _addListener<T extends PubSubMessage>(
		type: string,
		callback: (message: T) => void,
		scope?: string,
		...additionalParams: string[]
	) {
		await this._pubSubClient.connect();
		const userId = await this._getUserId();
		const topicName = [type, userId, ...additionalParams].join('.');
		const listener = new PubSubListener(topicName, userId, callback, this);
		if (this._listeners.has(topicName)) {
			this._listeners.get(topicName)!.push(listener);
		} else {
			this._listeners.set(topicName, [listener]);
			await this._pubSubClient.listen(topicName, this._authProvider, scope);
		}
		return listener;
	}
}
