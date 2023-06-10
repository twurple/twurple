import { rtfm } from '@twurple/common';
import {
	type HelixBaseExtensionData,
	type HelixExtensionSlotType
} from '../../../interfaces/endpoints/userExtension.external';
import { HelixBaseExtension } from './HelixBaseExtension';

/**
 * A Twitch Extension that is installed in a slot of a channel.
 *
 * @inheritDoc
 */
@rtfm<HelixInstalledExtension>('api', 'HelixInstalledExtension', 'id')
export class HelixInstalledExtension extends HelixBaseExtension {
	private readonly _slotType: HelixExtensionSlotType;
	private readonly _slotId: string;

	/** @internal */
	constructor(slotType: HelixExtensionSlotType, slotId: string, data: HelixBaseExtensionData) {
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
