import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatViewerMilestoneInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing a viewer milestone in chat.
 *
 * @meta category events
 */
@rtfm<ViewerMilestoneEvent>('easy-bot', 'ViewerMilestoneEvent', 'userId')
export class ViewerMilestoneEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _info: ChatViewerMilestoneInfo;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, info: ChatViewerMilestoneInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The ID of the user who reached the milestone.
	 */
	get userId(): string {
		return this._msg.userInfo.userId;
	}

	/**
	 * The name of the user who reached the milestone.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * The display name of the user who reached the milestone.
	 */
	get userDisplayName(): string {
		return this._msg.userInfo.displayName;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	/**
	 * The name of the milestone category.
	 */
	get categoryName(): string {
		return this._info.categoryName;
	}

	/**
	 * The value of the milestone (e.g., number of streams for watch-streak).
	 */
	get value(): number | undefined {
		return this._info.value;
	}

	/**
	 * The reward received for the milestone (e.g., channel points).
	 */
	get reward(): number | undefined {
		return this._info.reward;
	}

	/**
	 * The message sent with the milestone.
	 */
	get message(): string | undefined {
		return this._info.message;
	}
}
