import { indexBy } from '@d-fischer/shared-utils';
import type {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CheermoteFormat,
	CheermoteScale,
	CheermoteState
} from '@twurple/common';
import { BaseCheermoteList, HellFreezesOverError, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export type HelixCheermoteActionImageUrlsByScale = Record<CheermoteScale, string>;

/** @private */
export type HelixCheermoteActionImageUrlsByStateAndScale = Record<CheermoteState, HelixCheermoteActionImageUrlsByScale>;

/** @private */
export type HelixCheermoteActionImageUrlsByBackgroundAndStateAndScale = Record<
	CheermoteBackground,
	HelixCheermoteActionImageUrlsByStateAndScale
>;

/** @private */
export interface HelixCheermoteTierData {
	min_bits: number;
	id: string;
	color: string;
	images: HelixCheermoteActionImageUrlsByBackgroundAndStateAndScale[];
	can_cheer: boolean;
	show_in_bits_card: boolean;
}

/** @private */
type HelixCheermoteType = 'global_first_party' | 'global_third_party' | 'channel_custom' | 'display_only' | 'sponsored';

/** @private */
export interface HelixCheermoteData {
	prefix: string;
	tiers: HelixCheermoteTierData[];
	type: HelixCheermoteType;
	last_updated: string;
	order: number;
}

/**
 * A list of cheermotes you can use globally or in a specific channel, depending on how you fetched the list.
 *
 * @inheritDoc
 */
@rtfm('api', 'HelixCheermoteList')
export class HelixCheermoteList extends BaseCheermoteList<Record<string, HelixCheermoteData>> {
	/** @private */
	constructor(data: HelixCheermoteData[]) {
		super(indexBy(data, action => action.prefix.toLowerCase()));
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

		const tiers = this[rawDataSymbol][name].tiers;
		const correctTier = tiers.sort((a, b) => b.min_bits - a.min_bits).find(tier => tier.min_bits <= bits);

		if (!correctTier) {
			throw new HellFreezesOverError(`Cheermote "${name}" does not have an applicable tier for ${bits} bits`);
		}

		return {
			// @ts-expect-error TS7015 TODO will be fixed with the removal of enums
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
			url: correctTier.images[background][state][scale],
			color: correctTier.color
		};
	}

	/**
	 * Gets all possible cheermote names.
	 */
	getPossibleNames(): string[] {
		return Object.keys(this[rawDataSymbol]);
	}
}
