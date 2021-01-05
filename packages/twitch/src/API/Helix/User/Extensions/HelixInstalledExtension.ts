import { rtfm } from 'twitch-common';
import type { HelixExtensionData } from './HelixExtension';
import { HelixExtension } from './HelixExtension';

/**
 * The possible extension slot types.
 */
export type HelixExtensionSlotType = 'panel' | 'overlay' | 'component';

/**
 * A Twitch Extension that is installed in a slot of a channel.
 */
@rtfm<HelixInstalledExtension>('twitch', 'HelixSlottedExtension', 'id')
export class HelixInstalledExtension extends HelixExtension {
	private readonly _slotType: HelixExtensionSlotType;
	private readonly _slotId: string;

	/** @private */
	constructor(slotType: HelixExtensionSlotType, slotId: string, data: HelixExtensionData) {
		super(data);
		this._slotType = slotType;
		this._slotId = slotId;
	}

	/**
	 * The type of the slot the extension is in.
	 */
	get slotType(): HelixExtensionSlotType {
		return this._slotType;
	}

	/**
	 * The ID of the slot the extension is in.
	 */
	get slotId(): string {
		return this._slotId;
	}
}
