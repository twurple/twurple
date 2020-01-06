import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient, { extractUserId, UserIdResolvable } from 'twitch';
import BasicPubSubClient from './BasicPubSubClient';
import PubSubBitsBadgeUnlockMessage from './Messages/PubSubBitsBadgeUnlockMessage';
import PubSubBitsMessage from './Messages/PubSubBitsMessage';
import PubSubChatModActionMessage from './Messages/PubSubChatModActionMessage';
import PubSubRedemptionMessage from './Messages/PubSubRedemptionMessage';
import PubSubSubscriptionMessage from './Messages/PubSubSubscriptionMessage';
import PubSubWhisperMessage from './Messages/PubSubWhisperMessage';
import SingleUserPubSubClient from './SingleUserPubSubClient';

export default class PubSubClient {
	@NonEnumerable private readonly _rootClient: BasicPubSubClient;
	@NonEnumerable private readonly _userClients = new Map<string, SingleUserPubSubClient>();

	constructor(rootClient?: BasicPubSubClient) {
		this._rootClient = rootClient ?? new BasicPubSubClient();
	}

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

	getUserListener(user: UserIdResolvable) {
		const userId = extractUserId(user);
		if (!this._userClients.has(userId)) {
			throw new Error(`No Twitch client registered for user ID ${userId}`);
		}
		return this._userClients.get(userId)!;
	}

	async onBits(user: UserIdResolvable, callback: (message: PubSubBitsMessage) => void) {
		return this.getUserListener(user).onBits(callback);
	}

	async onBitsBadgeUnlock(user: UserIdResolvable, callback: (message: PubSubBitsBadgeUnlockMessage) => void) {
		return this.getUserListener(user).onBitsBadgeUnlock(callback);
	}

	async onRedemption(user: UserIdResolvable, callback: (message: PubSubRedemptionMessage) => void) {
		return this.getUserListener(user).onRedemption(callback);
	}

	async onSubscription(user: UserIdResolvable, callback: (message: PubSubSubscriptionMessage) => void) {
		return this.getUserListener(user).onSubscription(callback);
	}

	async onWhisper(user: UserIdResolvable, callback: (message: PubSubWhisperMessage) => void) {
		return this.getUserListener(user).onWhisper(callback);
	}

	async onModAction(
		user: UserIdResolvable,
		channel: UserIdResolvable,
		callback: (message: PubSubChatModActionMessage) => void
	) {
		return this.getUserListener(user).onModAction(channel, callback);
	}
}
