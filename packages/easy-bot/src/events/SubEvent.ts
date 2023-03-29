import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a user subscribing to a channel.
 *
 * @meta category events
 */
@rtfm<SubEvent>('easy-bot', 'SubEvent', 'userId')
export class SubEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _info: ChatSubInfo;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) protected readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, info: ChatSubInfo, msg: UserNotice, bot: Bot) {
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
	 * The ID of the user subscribing to the channel.
	 */
	get userId(): string {
		return this._msg.userInfo.userId;
	}

	/**
	 * The name of the user subscribing to the channel.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * The display name of the user subscribing to the channel.
	 */
	get userDisplayName(): string {
		return this._info.displayName;
	}

	/**
	 * Gets more information about the user subscribing to the channel.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	/**
	 * The plan of the subscription.
	 */
	get plan(): string {
		return this._info.plan;
	}

	/**
	 * The display name of the plan of the subscription.
	 */
	get planName(): string {
		return this._info.planName;
	}

	/**
	 * Whether the subscription was "paid" for using Prime Gaming.
	 */
	get isPrime(): boolean {
		return this._info.isPrime;
	}

	/**
	 * The number of total months of subscriptions for the channel.
	 */
	get months(): number {
		return this._info.months;
	}

	/**
	 * The number of consecutive months of subscriptions for the channel,
	 * or `null` if the user resubscribing does not choose to share that information.
	 */
	get streak(): number | null {
		return this._info.streak ?? null;
	}

	/**
	 * The message sent with the subscription, or `null` if there is none.
	 */
	get message(): string | null {
		return this._info.message ?? null;
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): UserNotice {
		return this._msg;
	}

	/**
	 * Whether the announced subscription is a continuation of a previously gifted multi-month subscription.
	 */
	get wasGift(): boolean {
		return !!this._info.originalGiftInfo;
	}

	/**
	 * Whether the announced subscription is a continuation of a previously anonymously gifter multi-month subscription.
	 */
	get wasAnonymousGift(): boolean {
		return this._info.originalGiftInfo?.anonymous ?? false;
	}

	/**
	 * The ID of the user who originally gifted the current multi-month subscription,
	 * or `null` if they were anonymous or the subscription is not a continuation of a multi-month subscription.
	 */
	get originalGifterId(): string | null {
		return this._info.originalGiftInfo?.userId ?? null;
	}

	/**
	 * The name of the user who originally gifted the current multi-month subscription,
	 * or `null` if they were anonymous or the subscription is not a continuation of a multi-month subscription.
	 */
	get originalGifterName(): string | null {
		return this._info.originalGiftInfo?.userName ?? null;
	}

	/**
	 * The display name of the user who originally gifted the current multi-month subscription,
	 * or `null` if they were anonymous or the subscription is not a continuation of a multi-month subscription.
	 */
	get originalGifterDisplayName(): string | null {
		return this._info.originalGiftInfo?.userDisplayName ?? null;
	}

	/**
	 * Gets more information about the user who originally gifted the current multi-month subscription,
	 * or `null` if they were anonymous or the subscription is not a continuation of a multi-month subscription.
	 */
	async getOriginalGifter(): Promise<HelixUser | null> {
		const id = this.originalGifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}

	/**
	 * The total duration of the current multi-month subscription,
	 * or `null` if the subscription is not a continuation of a multi-month subscription.
	 */
	get originalGiftDuration(): number | null {
		return this._info.originalGiftInfo?.duration ?? null;
	}

	/**
	 * The number of the month out of the total gift duration that was just redeemed,
	 * or `null` if the subscription is not a continuation of a multi-month subscription.
	 */
	get giftRedeemedMonth(): number | null {
		return this._info.originalGiftInfo?.redeemedMonth ?? null;
	}
}
