import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatCommunitySubInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a user gifting subscriptions to the community of a channel.
 *
 * @meta category events
 */
@rtfm<CommunitySubEvent>('easy-bot', 'CommunitySubEvent', 'gifterId')
export class CommunitySubEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _info: ChatCommunitySubInfo;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, info: ChatCommunitySubInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._info = info;
		this._msg = msg;
		this._bot = bot;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._msg.channelId!;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._broadcasterName;
	}

	/**
	 * Gets more info about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The ID of the user who sent the gift.
	 */
	get gifterId(): string | null {
		return this._info.gifterUserId ?? null;
	}

	/**
	 * The name of the user who sent the gift.
	 */
	get gifterName(): string | null {
		return this._info.gifter ?? null;
	}

	/**
	 * The display name of the user who sent the gift.
	 */
	get gifterDisplayName(): string | null {
		return this._info.gifterDisplayName ?? null;
	}

	/**
	 * Gets more information about the user who sent the gift.
	 */
	async getGifter(): Promise<HelixUser | null> {
		const id = this.gifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}

	/**
	 * The plan of the gifted subscription.
	 */
	get plan(): string {
		return this._info.plan;
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): UserNotice {
		return this._msg;
	}
}
