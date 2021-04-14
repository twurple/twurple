import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';

/** @private */
export interface HelixTagData {
	tag_id: string;
	is_auto: boolean;
	localization_names: Record<string, string>;
	localization_descriptions: Record<string, string>;
}

/**
 * A stream tag.
 */
@rtfm<HelixTag>('twitch', 'HelixTag', 'id')
export class HelixTag {
	@Enumerable(false) private readonly _data: HelixTagData;

	/** @private */
	constructor(data: HelixTagData) {
		this._data = data;
	}

	/**
	 * The ID of the tag.
	 */
	get id(): string {
		return this._data.tag_id;
	}

	/**
	 * Whether the tag is automatically assigned by Twitch.
	 */
	get isAuto(): boolean {
		return this._data.is_auto;
	}

	/**
	 * Gets the name of the tag in the specified language.
	 */
	getName(language: string): string | undefined {
		return this._data.localization_names[language];
	}

	/**
	 * Gets the description of the tag in the specified language.
	 */
	getDescription(language: string): string | undefined {
		return this._data.localization_descriptions[language];
	}
}
