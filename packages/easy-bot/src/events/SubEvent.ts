import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<SubEvent>('easy-bot', 'SubEvent', 'userId')
export class SubEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _info: ChatSubInfo;
	@Enumerable(false) protected readonly _msg: UserNotice;
	@Enumerable(false) protected readonly _bot: Bot;

	constructor(channel: string, userName: string, info: ChatSubInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._info = info;
		this._msg = msg;
		this._bot = bot;
	}

	get broadcasterId(): string {
		return this._msg.channelId!;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	get userId(): string {
		return this._msg.userInfo.userId;
	}

	get userName(): string {
		return this._userName;
	}

	get userDisplayName(): string {
		return this._info.displayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get plan(): string {
		return this._info.plan;
	}

	get planName(): string {
		return this._info.planName;
	}

	get isPrime(): boolean {
		return this._info.isPrime;
	}

	get months(): number {
		return this._info.months;
	}

	get streak(): number | null {
		return this._info.streak ?? null;
	}

	get message(): string | null {
		return this._info.message ?? null;
	}

	get messageObject(): UserNotice {
		return this._msg;
	}

	get wasGift(): boolean {
		return !!this._info.originalGiftInfo;
	}

	get wasAnonymousGift(): boolean {
		return this._info.originalGiftInfo?.anonymous ?? false;
	}

	get originalGifterId(): string | null {
		return this._info.originalGiftInfo?.userId ?? null;
	}

	get originalGifterName(): string | null {
		return this._info.originalGiftInfo?.userName ?? null;
	}

	get originalGifterDisplayName(): string | null {
		return this._info.originalGiftInfo?.userDisplayName ?? null;
	}

	async getOriginalGifter(): Promise<HelixUser | null> {
		const id = this.originalGifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}

	get originalGiftDuration(): number | null {
		return this._info.originalGiftInfo?.duration ?? null;
	}

	get giftRedeemedMonth(): number | null {
		return this._info.originalGiftInfo?.redeemedMonth ?? null;
	}
}
