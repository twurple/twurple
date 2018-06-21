import TwitchClient from '../../TwitchClient';
import { NonEnumerable } from '../../Toolkit/Decorators';
import ObjectTools, { UniformObject } from '../../Toolkit/ObjectTools';
import * as defaults from 'defaults';

/**
 * The type of background a cheermote is supposed to appear on.
 *
 * We will supply a fitting graphic that does not show any artifacts
 * on the given type of background.
 */
export enum CheermoteBackground {
	/**
	 * A dark background.
	 *
	 * Cheermotes might show artifacts on bright backgrounds.
	 */
	dark = 'dark',

	/**
	 * A bright background.
	 *
	 * Cheermotes might show artifacts on dark backgrounds.
	 */
	light = 'light'
}

/**
 * The state of a cheermote, i.e. whether it's animated or not.
 */
export enum CheermoteState {
	/**
	 * The cheermote should be animated.
	 */
	animated = 'animated',

	/**
	 * The cheermote should not be animated.
	 */
	static = 'static'
}

/**
 * The scale of the cheermote, which usually relates to the pixel density of the device in use.
 */
export enum CheermoteScale {
	/**
	 * The cheermote should not be scaled.
	 */
	x1 = '1',

	/**
	 * The cheermote should be scaled 1.5x.
	 */
	x1_5 = '1.5',

	/**
	 * The cheermote should be scaled 2x.
	 */
	x2 = '2',

	/**
	 * The cheermote should be scaled 3x.
	 */
	x3 = '3',

	/**
	 * The cheermote should be scaled 4x.
	 */
	x4 = '4'
}

/** @private */
export type CheermoteActionImageUrlsByScale = {
	[scale in CheermoteScale]: string;
};

/** @private */
export type CheermoteActionImageUrlsByStateAndScale = {
	[state in CheermoteState]: CheermoteActionImageUrlsByScale;
};

/** @private */
export type CheermoteActionImageUrlsByBackgroundAndStateAndScale = {
	[background in CheermoteBackground]: CheermoteActionImageUrlsByStateAndScale;
};

/** @private */
export interface CheermoteActionTierData {
	min_bits: number;
	id: string;
	color: string;
	images: CheermoteActionImageUrlsByBackgroundAndStateAndScale[];
}

/** @private */
export interface CheermoteActionData {
	prefix: string;
	scales: string[];
	tiers: CheermoteActionTierData[];
	backgrounds: string[];
	states: string[];
	type: string;
	updated_at: string;
	priority: number;
}

/** @private */
export interface CheermoteListData {
	actions: CheermoteActionData[];
}

/**
 * The format of the cheermote you want to request.
 */
export interface CheermoteFormat {
	/**
	 * The desired background for the cheermote.
	 */
	background: CheermoteBackground;

	/**
	 * The desired cheermote state.
	 */
	state: CheermoteState;

	/**
	 * The desired cheermote scale.
	 */
	scale: CheermoteScale;
}

/**
 * The details on how a cheermote should be displayed.
 */
export interface CheermoteDisplayInfo {
	/**
	 * The URL of the image that should be shown.
	 */
	url: string;

	/**
	 * The color that should be used to shown the cheer amount.
	 *
	 * This is a hexadecimal color value, e.g. `#9c3ee8`.
	 */
	color: string;
}

/**
 * A list of cheermotes you can use globally or in a specific channel, depending on how you fetched the list.
 */
export default class CheermoteList {
	@NonEnumerable private readonly _client: TwitchClient;
	private readonly _data: UniformObject<CheermoteActionData>;

	/** @private */
	constructor(data: CheermoteActionData[], client: TwitchClient) {
		this._client = client;
		this._data = ObjectTools.indexBy(data, action => action.prefix.toLowerCase());
	}

	/**
	 * Gets the URL and color needed to properly represent a cheer of a given amount of bits with a given prefix.
	 *
	 * @param name The name/prefix of the cheermote.
	 * @param bits The amount of bits cheered.
	 * @param format The format of the cheermote you want to request.
	 */
	getCheermoteDisplayInfo(name: string, bits: number, format?: Partial<CheermoteFormat>): CheermoteDisplayInfo {
		name = name.toLowerCase();
		const cheermoteDefaults = this._client._config.cheermotes;
		const fullOptions: CheermoteFormat = defaults(format || {}, {
			background: cheermoteDefaults.defaultBackground,
			state: cheermoteDefaults.defaultState,
			scale: cheermoteDefaults.defaultScale
		});

		const tiers = this._data[name].tiers;
		const correctTier = tiers.sort((a, b) => b.min_bits - a.min_bits).find(tier => tier.min_bits <= bits);

		if (!correctTier) {
			throw new Error(`Cheermote "${name}" does not have an applicable tier for ${bits} bits`);
		}

		return {
			url: correctTier.images[fullOptions.background][fullOptions.state][fullOptions.scale],
			color: correctTier.color
		};
	}
}
