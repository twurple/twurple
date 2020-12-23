import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from 'twitch';
import { getValidTokenFromProvider, InvalidTokenTypeError } from 'twitch-auth';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BasicPubSubClient } from './BasicPubSubClient';
import type { PubSubBitsBadgeUnlockMessage } from './Messages/PubSubBitsBadgeUnlockMessage';
import type { PubSubBitsMessage } from './Messages/PubSubBitsMessage';
import type { PubSubChatModActionMessage } from './Messages/PubSubChatModActionMessage';
import type { PubSubRedemptionMessage } from './Messages/PubSubRedemptionMessage';
import type { PubSubSubscriptionMessage } from './Messages/PubSubSubscriptionMessage';
import type { PubSubWhisperMessage } from './Messages/PubSubWhisperMessage';
import type { PubSubListener } from './PubSubListener';
import { SingleUserPubSubClient } from './SingleUserPubSubClient';

/**
 * A high level PubSub client attachable to a multiple users.
 */
@rtfm('twitch-pubsub-client', 'PubSubClient')
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
	 * Attaches a new user to the listener and returns the user ID for convenience.
	 *
	 * @param apiClient The client that provides authentication for the user.
	 * @param user The user that the client will be attached to.
	 *
	 * This should only be passed manually if you fetched the token info for the `apiClient` before.
	 *
	 * If not given, the user will be determined from the `apiClient`.
	 */
	async registerUserListener(apiClient: ApiClient, user?: UserIdResolvable): Promise<string> {
		let userId;
		if (user) {
			userId = extractUserId(user);
		} else {
			if (apiClient.tokenType === 'app') {
				throw new InvalidTokenTypeError(
					'App tokens are not supported by PubSubClient; you need to pass authentication representing a user.'
				);
			}
			const { tokenInfo } = await getValidTokenFromProvider(apiClient);
			userId = tokenInfo.userId;
		}

		this._userClients.set(
			userId,
			new SingleUserPubSubClient({ twitchClient: apiClient, pubSubClient: this._rootClient })
		);

		return userId;
	}

	/** @private */
	getUserListener(user: UserIdResolvable): SingleUserPubSubClient {
		const userId = extractUserId(user);
		if (!this._userClients.has(userId)) {
			throw new Error(`No API client registered for user ID ${userId}
Register one using:

\tpubSubClient.registerUserListener(apiClient);`);
		}
		return this._userClients.get(userId)!;
	}

	/**
	 * Adds a listener to bits events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bits event happens in the user's channel.
	 *
	 * It receives a {@PubSubBitsMessage} object.
	 */
	async onBits(
		user: UserIdResolvable,
		callback: (message: PubSubBitsMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onBits(callback);
	}

	/**
	 * Adds a listener to bits badge unlock events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a bit badge is unlocked in the user's channel.
	 *
	 * It receives a {@PubSubBitsBadgeUnlockMessage} object.
	 */
	async onBitsBadgeUnlock(
		user: UserIdResolvable,
		callback: (message: PubSubBitsBadgeUnlockMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onBitsBadgeUnlock(callback);
	}

	/**
	 * Adds a listener to redemption events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a channel point reward is redeemed in the user's channel.
	 *
	 * It receives a {@PubSubRedemptionMessage} object.
	 */
	async onRedemption(
		user: UserIdResolvable,
		callback: (message: PubSubRedemptionMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onRedemption(callback);
	}

	/**
	 * Adds a listener to subscription events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a subscription event happens in the user's channel.
	 *
	 * It receives a {@PubSubSubscriptionMessage} object.
	 */
	async onSubscription(
		user: UserIdResolvable,
		callback: (message: PubSubSubscriptionMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onSubscription(callback);
	}

	/**
	 * Adds a listener to whisper events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param callback A function to be called when a whisper is sent to the user.
	 *
	 * It receives a {@PubSubWhisperMessage} object.
	 */
	async onWhisper(
		user: UserIdResolvable,
		callback: (message: PubSubWhisperMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onWhisper(callback);
	}

	/**
	 * Adds a listener to mod action events to the client.
	 *
	 * @param user The user the event will be subscribed for.
	 * @param channel The channel the event will be subscribed for.
	 * @param callback A function to be called when a mod action event is sent to the user.
	 *
	 * It receives a {@PubSubChatModActionMessage} object.
	 */
	async onModAction(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubChatModActionMessage) => void
	): Promise<PubSubListener<never>> {
		return this.getUserListener(user).onModAction(channel, callback);
	}
}
