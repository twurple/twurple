/** @private */
export interface HelixBaseExtensionData {
	id: string;
	version: string;
	name: string;
}

/**
 * The possible extension slot types.
 */
export type HelixExtensionSlotType = 'panel' | 'overlay' | 'component';

/** @private */
export interface HelixInstalledExtensionData extends HelixBaseExtensionData {
	active: true;
}

/** @private */
export interface HelixEmptySlotData {
	active: false;
}

/** @private */
export type HelixExtensionSlotData = HelixInstalledExtensionData | HelixEmptySlotData;

/** @private */
export interface HelixInstalledExtensionListData {
	panel: Record<'1' | '2' | '3', HelixExtensionSlotData>;
	overlay: Record<'1', HelixExtensionSlotData>;
	component: Record<'1' | '2', HelixExtensionSlotData>;
}

/** @private */
export type HelixExtensionType = HelixExtensionSlotType | 'mobile';

/** @private */
export interface HelixUserExtensionData extends HelixBaseExtensionData {
	can_activate: boolean;
	type: HelixExtensionType[];
}
