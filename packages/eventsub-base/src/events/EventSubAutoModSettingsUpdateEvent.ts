import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModLevel } from './common/EventSubAutoModLevel.js';
import { type EventSubAutoModSettingsUpdateEventData } from './EventSubAutoModSettingsUpdateEvent.external.js';

/**
 * An EventSub event representing the AutoMod settings being updated in a channel.
 */
@rtfm<EventSubAutoModSettingsUpdateEvent>('eventsub-base', 'EventSubAutoModSettingsUpdateEvent', 'broadcasterId')
export class EventSubAutoModSettingsUpdateEvent extends DataObject<EventSubAutoModSettingsUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubAutoModSettingsUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose channel the AutoMod settings were updated.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel the AutoMod settings were changed.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose channel the AutoMod settings were changed.
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
	 * The ID of the moderator who changed the AutoMod settings.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who changed the AutoMod settings.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who changed the AutoMod settings.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Gets more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id));
	}

	/**
	 * The default AutoMod level for the broadcaster.
	 *
	 * This field is `null` if the broadcaster has set one or more of the individual settings.
	 */
	get overallLevel(): EventSubAutoModLevel | null {
		return this[rawDataSymbol].overall_level;
	}

	/**
	 * The AutoMod level for hostility involving aggression.
	 */
	get aggression(): EventSubAutoModLevel {
		return this[rawDataSymbol].aggression;
	}

	/**
	 * The AutoMod level for hostility involving name-calling, insults, or antagonization.
	 */
	get bullying(): EventSubAutoModLevel {
		return this[rawDataSymbol].bullying;
	}

	/**
	 * The AutoMod level for discrimination against perceived or actual mental or physical abilities.
	 */
	get disability(): EventSubAutoModLevel {
		return this[rawDataSymbol].disability;
	}

	/**
	 * The AutoMod level for discrimination against women.
	 */
	get misogyny(): EventSubAutoModLevel {
		return this[rawDataSymbol].misogyny;
	}

	/**
	 * The AutoMod level for discrimination based on race, ethnicity, or religion.
	 */
	get raceEthnicityOrReligion(): EventSubAutoModLevel {
		return this[rawDataSymbol].race_ethnicity_or_religion;
	}

	/**
	 * The AutoMod level for sex-based terms, e.g. sexual acts or anatomy.
	 */
	get sexBasedTerms(): EventSubAutoModLevel {
		return this[rawDataSymbol].sex_based_terms;
	}

	/**
	 * The AutoMod level for discrimination based on sexuality, sex, or gender.
	 */
	get sexualitySexOrGender(): EventSubAutoModLevel {
		return this[rawDataSymbol].sexuality_sex_or_gender;
	}

	/**
	 * The AutoMod level for profanity.
	 */
	get swearing(): EventSubAutoModLevel {
		return this[rawDataSymbol].swearing;
	}
}
