import { Enumerable } from '@d-fischer/shared-utils';
import { extractUserId, TwitchClient, UserIdResolvable } from 'twitch';
import { BasicPubSubClient } from './BasicPubSubClient';
import { PubSubBitsBadgeUnlockMessage } from './Messages/PubSubBitsBadgeUnlockMessage';
import { PubSubBitsMessage } from './Messages/PubSubBitsMessage';
import { PubSubChatModActionMessage } from './Messages/PubSubChatModActionMessage';
import { PubSubRedemptionMessage } from './Messages/PubSubRedemptionMessage';
import { PubSubSubscriptionMessage } from './Messages/PubSubSubscriptionMessage';
import { PubSubWhisperMessage } from './Messages/PubSubWhisperMessage';
import { SingleUserPubSubClient } from './SingleUserPubSubClient';

/**
 * A high level PubSub client attachable to a multiple users.
 */
export class PubSubClient {
	@Enumerable(false) private readonly _rootClient: BasicPubSubClient;
	@Enumerable(false) private readonly _userClients = new Map<string, SingleUserPubSubClient>();

	/**
	 * Creates a new PubSub client.
	 *
	 * @param rootClient A previously existing PubSubClient instance.
	 *
	 * If not given, one will be created with the default options.
	 */
	constructor(rootClient?: BasicPubSubClient) {
		this._rootClient = rootClient ?? new BasicPubSubClient();
	}

	/**
	 * Attaches a new user to the listener.
	 *
	 * @param twitchClient The client that provides authentication for the user.
	 * @param user The user that the client will be attached to.
	 *
	 * This should only be passed manually if you fetched the token info for the `twitchClient` before.
	 *
	 * If not given, the user will be determined from the `twitchClient`.
	 */
	async registerUserListener(twitchClient: TwitchClient, user?: UserIdResolvable) {
		let userId;
		if (user) {
			userId = extractUserId(user);
		} else {
			const tokenInfo = await twitchClient.getTokenInfo();
			if (!tokenInfo.userId) {
				throw new Error('Passed a Twitch client that is not bound to a user');
			}
			userId = tokenInfo.userId;
		}

		this._userClients.set(
			userId,
			new SingleUserPubSubClient({ twitchClient: twitchClient, pubSubClient: this._rootClient })
		);
	}

	/** @private */
	getUserListener(user: UserIdResolvable) {
		const userId = extractUserId(user);
		if (!this._userClients.has(userId)) {
			throw new Error(`No Twitch client registered for user ID ${userId}`);
		}
		return this._userClients.get(userId)!;
	}

	/**
	 * Adds a listener to bits events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param callback A function to be called when a bits event happens in the user's channel.
	 *
	 * It receives a {@PubSubBitsMessage} object.
	 */
	async onBits(user: UserIdResolvable, callback: (message: PubSubBitsMessage) => void) {
		return this.getUserListener(user).onBits(callback);
	}

	/**
	 * Adds a listener to bits badge unlock events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param callback A function to be called when a bit badge is unlocked in the user's channel.
	 *
	 * It receives a {@PubSubBitsBadgeUnlockMessage} object.
	 */
	async onBitsBadgeUnlock(user: UserIdResolvable, callback: (message: PubSubBitsBadgeUnlockMessage) => void) {
		return this.getUserListener(user).onBitsBadgeUnlock(callback);
	}

	/**
	 * Adds a listener to redemption events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param callback A function to be called when a channel point reward is redeemed in the user's channel.
	 *
	 * It receives a {@PubSubBitsRedemptionMessage} object.
	 */
	async onRedemption(user: UserIdResolvable, callback: (message: PubSubRedemptionMessage) => void) {
		return this.getUserListener(user).onRedemption(callback);
	}

	/**
	 * Adds a listener to subscription events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param callback A function to be called when a subscription event happens in the user's channel.
	 *
	 * It receives a {@PubSubSubscriptionMessage} object.
	 */
	async onSubscription(user: UserIdResolvable, callback: (message: PubSubSubscriptionMessage) => void) {
		return this.getUserListener(user).onSubscription(callback);
	}

	/**
	 * Adds a listener to whisper events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param callback A function to be called when a whisper is sent to the user.
	 *
	 * It receives a {@PubSubWhisperMessage} object.
	 */
	async onWhisper(user: UserIdResolvable, callback: (message: PubSubWhisperMessage) => void) {
		return this.getUserListener(user).onWhisper(callback);
	}

	/**
	 * Adds a listener to mod action events to the client.
	 *
	 * @param user The user this event will be subscribed for.
	 * @param channel The channel this event will be subscribed for.
	 * @param callback A function to be called when a mod action event is sent to the user.
	 *
	 * It receives a {@PubSubChatModActionMessage} object.
	 */
	async onModAction(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubChatModActionMessage) => void
	) {
		return this.getUserListener(user).onModAction(channel, callback);
	}
}
