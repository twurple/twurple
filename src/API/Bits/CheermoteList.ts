import TwitchClient from '../../TwitchClient';
import { NonEnumerable } from '../../Toolkit/Decorators';
import ObjectTools, { UniformObject } from '../../Toolkit/ObjectTools';
import * as defaults from 'defaults';

/**
 * Specifies the type of background the cheermote is supposed to appear on.
 *
 * We will supply a fitting graphic that does not show any artifacts
 * on the given type of background.
 */
export enum CheermoteBackground {
	/**
	 * Specifies a dark background.
	 *
	 * Cheermotes might show artifacts on bright backgrounds.
	 */
	dark = 'dark',

	/**
	 * Specifies a bright background.
	 *
	 * Cheermotes might show artifacts on dark backgrounds.
	 */
	light = 'light'
}

export enum CheermoteState { animated = 'animated', 'static' = 'static' }

export enum CheermoteScale { x1 = '1', x1_5 = '1.5', x2 = '2', x3 = '3', x4 = '4' }

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

export interface CheermoteOptions {
	background: CheermoteBackground;
	state: CheermoteState;
	scale: CheermoteScale;
}

export interface CheermoteDisplayInfo {
	url: string;
	color: string;
}

export default class CheermoteList {
	@NonEnumerable private readonly _client: TwitchClient;
	private readonly _data: UniformObject<CheermoteActionData>;

	/** @private */
	constructor(data: CheermoteActionData[], client: TwitchClient) {
		this._client = client;
		this._data = ObjectTools.indexBy(data, action => action.prefix.toLowerCase());
	}

	getCheermoteDisplayInfo(name: string, bits: number, options?: Partial<CheermoteOptions>): CheermoteDisplayInfo {
		name = name.toLowerCase();
		const cheermoteDefaults = this._client._config.cheermotes;
		const fullOptions: CheermoteOptions = defaults(options || {}, {
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
