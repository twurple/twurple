import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixAutoModSettingsData {
	broadcaster_id: string;
	moderator_id: string;
	overall_level: number | null;
	disability: number;
	aggression: number;
	sexuality_sex_or_gender: number;
	misogyny: number;
	bullying: number;
	swearing: number;
	race_ethnicity_or_religion: number;
	sex_based_terms: number;
}

/**
 * The AutoMod settings of a channel.
 */
@rtfm<HelixAutoModSettings>('api', 'HelixAutoModSettings', 'broadcasterId')
export class HelixAutoModSettings extends DataObject<HelixAutoModSettingsData> {
	/**
	 * The ID of the broadcaster for which the AutoMod settings are retrieved.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The ID of a user that has permission to moderate the broadcaster's chat room.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * The default AutoMod level for the broadcaster. This is null if the broadcaster changed individual settings.
	 */
	get overallLevel(): number | null {
		return this[rawDataSymbol].overall_level ? this[rawDataSymbol].overall_level : null;
	}

	/**
	 * The Automod level for discrimination against disability.
	 */
	get disability(): number {
		return this[rawDataSymbol].disability;
	}

	/**
	 * The Automod level for hostility involving aggression.
	 */
	get aggression(): number {
		return this[rawDataSymbol].aggression;
	}

	/**
	 * The AutoMod level for discrimination based on sexuality, sex, or gender.
	 */
	get sexualitySexOrGender(): number {
		return this[rawDataSymbol].sexuality_sex_or_gender;
	}

	/**
	 * The Automod level for discrimination against women.
	 */
	get misogyny(): number {
		return this[rawDataSymbol].misogyny;
	}

	/**
	 * The Automod level for hostility involving name calling or insults.
	 */
	get bullying(): number {
		return this[rawDataSymbol].bullying;
	}

	/**
	 * The Automod level for profanity.
	 */
	get swearing(): number {
		return this[rawDataSymbol].swearing;
	}

	/**
	 * The Automod level for racial discrimination.
	 */
	get raceEthnicityOrReligion(): number {
		return this[rawDataSymbol].race_ethnicity_or_religion;
	}

	/**
	 * The Automod level for sexual content.
	 */
	get sexBasedTerms(): number {
		return this[rawDataSymbol].sex_based_terms;
	}
}
