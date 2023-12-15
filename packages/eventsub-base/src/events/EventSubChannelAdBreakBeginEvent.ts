import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelAdBreakBeginEventData } from './EventSubChannelAdBreakBeginEvent.external';

/**
 * An EventSub event representing an ad break beginning in a broadcaster channel.
 */
@rtfm<EventSubChannelAdBreakBeginEvent>('eventsub-base', 'EventSubChannelAdBreakBeginEvent', 'broadcasterId')
export class EventSubChannelAdBreakBeginEvent extends DataObject<EventSubChannelAdBreakBeginEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelAdBreakBeginEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The broadcaster's user ID for the channel the ad was run on.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The broadcaster's user login for the channel the ad was run on.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The broadcaster's user display name for the channel the ad was run on.
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
	 * The ID of the user that requested the ad. For automatic ads, this will be the ID of the broadcaster.
	 */
	get requesterId(): string {
		return this[rawDataSymbol].requester_user_id;
	}

	/**
	 * The login of the user that requested the ad.
	 */
	get requesterName(): string {
		return this[rawDataSymbol].requester_user_login;
	}

	/**
	 * The display name of the user that requested the ad.
	 */
	get requesterDisplayName(): string {
		return this[rawDataSymbol].requester_user_name;
	}

	/**
	 * Gets more information about the user that requested the ad.
	 */
	async getRequester(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].requester_user_id));
	}

	/**
	 * Length in seconds of the mid-roll ad break requested.
	 */
	get durationSeconds(): number {
		return this[rawDataSymbol].duration_seconds;
	}

	/**
	 * The date/time when the ad break started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * Indicates if the ad was automatically scheduled via Ads Manager
	 */
	get isAutomatic(): boolean {
		return this[rawDataSymbol].is_automatic;
	}
}
