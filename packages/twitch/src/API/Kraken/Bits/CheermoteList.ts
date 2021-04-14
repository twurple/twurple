import { Enumerable, indexBy } from '@d-fischer/shared-utils';
import type {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CheermoteFormat,
	CheermoteScale,
	CheermoteState
} from '@twurple/common';
import { BaseCheermoteList, HellFreezesOverError, rtfm } from '@twurple/common';

/** @private */
export type CheermoteActionImageUrlsByScale = Record<CheermoteScale, string>;

/** @private */
export type CheermoteActionImageUrlsByStateAndScale = Record<CheermoteState, CheermoteActionImageUrlsByScale>;

/** @private */
export type CheermoteActionImageUrlsByBackgroundAndStateAndScale = Record<
	CheermoteBackground,
	CheermoteActionImageUrlsByStateAndScale
>;

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
 * A list of cheermotes you can use globally or in a specific channel, depending on how you fetched the list.
 *
 * @inheritDoc
 */
@rtfm('twitch', 'CheermoteList')
export class CheermoteList extends BaseCheermoteList {
	@Enumerable(false) private readonly _data: Record<string, CheermoteActionData>;

	/** @private */
	constructor(data: CheermoteActionData[]) {
		super();
		this._data = indexBy(data, action => action.prefix.toLowerCase());
	}

	/**
	 * Gets the URL and color needed to properly represent a cheer of the given amount of bits with the given prefix.
	 *
	 * @param name The name/prefix of the cheermote.
	 * @param bits The amount of bits cheered.
	 * @param format The format of the cheermote you want to request.
	 */
	getCheermoteDisplayInfo(name: string, bits: number, format: CheermoteFormat): CheermoteDisplayInfo {
		name = name.toLowerCase();
		const { background, state, scale } = format;

		const tiers = this._data[name].tiers;
		const correctTier = tiers.sort((a, b) => b.min_bits - a.min_bits).find(tier => tier.min_bits <= bits);

		if (!correctTier) {
			throw new HellFreezesOverError(`Cheermote "${name}" does not have an applicable tier for ${bits} bits`);
		}

		return {
			// @ts-expect-error TS7015 TODO will be fixed with the removal of enums
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
			url: correctTier.images[background][state][scale],
			color: correctTier.color
		};
	}

	/**
	 * Gets all possible cheermote names.
	 */
	getPossibleNames(): string[] {
		return Object.keys(this._data);
	}
}
