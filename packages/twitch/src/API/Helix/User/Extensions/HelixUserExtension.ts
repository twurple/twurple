import { rtfm } from 'twitch-common';
import type { HelixExtensionData } from './HelixExtension';
import { HelixExtension } from './HelixExtension';
import type { HelixExtensionSlotType } from './HelixInstalledExtension';

/** @private */
export type HelixExtensionType = HelixExtensionSlotType | 'mobile';

/** @private */
export interface HelixUserExtensionData extends HelixExtensionData {
	can_activate: boolean;
	type: HelixExtensionType[];
}

/**
 * A Twitch Extension that was installed by a user.
 *
 * @inheritDoc
 */
@rtfm<HelixUserExtension>('twitch', 'HelixUserExtension', 'id')
export class HelixUserExtension extends HelixExtension {
	/** @private */ protected declare readonly _data: HelixUserExtensionData;

	/**
	 * Whether the user has configured the extension to be able to activate it.
	 */
	get canActivate(): boolean {
		return this._data.can_activate;
	}

	/**
	 * The available types of the extension.
	 */
	get types(): HelixExtensionType[] {
		return this._data.type;
	}
}
