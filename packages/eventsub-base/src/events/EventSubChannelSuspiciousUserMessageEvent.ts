import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelSuspiciousUserLowTrustStatus } from './common/EventSubChannelSuspiciousUserLowTrustStatus';
import {
	type EventSubChannelBanEvasionEvaluation,
	type EventSubChannelSuspiciousUserType,
	type EventSubChannelSuspiciousUserMessageEventData,
	type EventSubChannelSuspiciousUserMessagePart,
} from './EventSubChannelSuspiciousUserMessageEvent.external';

/**
 * An EventSub event representing a message sent by a suspicious user in a channel.
 */
@rtfm<EventSubChannelSuspiciousUserMessageEvent>(
	'eventsub-base',
	'EventSubChannelSuspiciousUserMessageEvent',
	'broadcasterId',
)
export class EventSubChannelSuspiciousUserMessageEvent extends DataObject<EventSubChannelSuspiciousUserMessageEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelSuspiciousUserMessageEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the channel in which a suspicious user sent the message.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the channel in which a suspicious user sent the message.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the channel in which a suspicious user sent the message.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the user who sent the message.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who sent the message.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who sent the message.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user whose treatment was updated.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The status set for the suspicious user.
	 */
	get lowTrustStatus(): EventSubChannelSuspiciousUserLowTrustStatus {
		return this[rawDataSymbol].low_trust_status;
	}

	/**
	 * A list of channel IDs where the suspicious user is also banned.
	 */
	get sharedBanChannelIds(): string[] {
		return this[rawDataSymbol].shared_ban_channel_ids ?? [];
	}

	/**
	 * User types (if any) that apply to the suspicious user.
	 */
	get types(): EventSubChannelSuspiciousUserType[] {
		return this[rawDataSymbol].types;
	}

	/**
	 * A ban evasion likelihood value (if any) that as been applied to the user automatically by Twitch.
	 */
	get banEvasionEvaluation(): EventSubChannelBanEvasionEvaluation {
		return this[rawDataSymbol].ban_evasion_evaluation;
	}

	/**
	 * The UUID that identifies the message.
	 */
	get messageId(): string {
		return this[rawDataSymbol].message.message_id;
	}

	/**
	 * The chat message in plain text.
	 */
	get messageText(): string {
		return this[rawDataSymbol].message.text;
	}

	/**
	 * Ordered list of chat message fragments.
	 */
	get messageParts(): EventSubChannelSuspiciousUserMessagePart[] {
		return this[rawDataSymbol].message.fragments;
	}
}
