import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixAutoModSettingsData } from '../../../interfaces/helix/moderation.external';

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
	 * The AutoMod level for discrimination against disability.
	 */
	get disability(): number {
		return this[rawDataSymbol].disability;
	}

	/**
	 * The AutoMod level for hostility involving aggression.
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
	 * The AutoMod level for discrimination against women.
	 */
	get misogyny(): number {
		return this[rawDataSymbol].misogyny;
	}

	/**
	 * The AutoMod level for hostility involving name calling or insults.
	 */
	get bullying(): number {
		return this[rawDataSymbol].bullying;
	}

	/**
	 * The AutoMod level for profanity.
	 */
	get swearing(): number {
		return this[rawDataSymbol].swearing;
	}

	/**
	 * The AutoMod level for racial discrimination.
	 */
	get raceEthnicityOrReligion(): number {
		return this[rawDataSymbol].race_ethnicity_or_religion;
	}

	/**
	 * The AutoMod level for sexual content.
	 */
	get sexBasedTerms(): number {
		return this[rawDataSymbol].sex_based_terms;
	}
}
