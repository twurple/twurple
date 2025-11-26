import { indexBy } from '@d-fischer/shared-utils';
import { DataObject, HellFreezesOverError, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixCheermoteData } from '../../interfaces/endpoints/bits.external.js';
import { type CheermoteDisplayInfo, type CheermoteFormat } from './CheermoteDisplayInfo.js';

/**
 * A list of cheermotes you can use globally or in a specific channel, depending on how you fetched the list.
 *
 * @inheritDoc
 */
@rtfm('api', 'HelixCheermoteList')
export class HelixCheermoteList extends DataObject<Record<string, HelixCheermoteData>> {
	/** @internal */
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

		const { tiers } = this[rawDataSymbol][name];
		const correctTier = tiers.sort((a, b) => b.min_bits - a.min_bits).find(tier => tier.min_bits <= bits);

		if (!correctTier) {
			throw new HellFreezesOverError(`Cheermote "${name}" does not have an applicable tier for ${bits} bits`);
		}

		return {
			url: correctTier.images[background][state][scale],
			color: correctTier.color,
		};
	}

	/**
	 * Gets all possible cheermote names.
	 */
	getPossibleNames(): string[] {
		return Object.keys(this[rawDataSymbol]);
	}
}
