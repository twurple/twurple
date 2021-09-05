import { rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixBaseExtensionData } from './HelixBaseExtension';
import { HelixBaseExtension } from './HelixBaseExtension';
import type { HelixExtensionSlotType } from './HelixInstalledExtension';

/** @private */
export type HelixExtensionType = HelixExtensionSlotType | 'mobile';

/** @private */
export interface HelixUserExtensionData extends HelixBaseExtensionData {
	can_activate: boolean;
	type: HelixExtensionType[];
}

/**
 * A Twitch Extension that was installed by a user.
 *
 * @inheritDoc
 */
@rtfm<HelixUserExtension>('api', 'HelixUserExtension', 'id')
export class HelixUserExtension extends HelixBaseExtension {
	/** @private */ declare readonly [rawDataSymbol]: HelixUserExtensionData;

	/**
	 * Whether the user has configured the extension to be able to activate it.
	 */
	get canActivate(): boolean {
		return this[rawDataSymbol].can_activate;
	}

	/**
	 * The available types of the extension.
	 */
	get types(): HelixExtensionType[] {
		return this[rawDataSymbol].type;
	}
}
