/// <reference lib="es2019.array" />

import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { HelixExtensionData } from './HelixExtension';
import type { HelixExtensionSlotType } from './HelixInstalledExtension';
import { HelixInstalledExtension } from './HelixInstalledExtension';

/** @private */
export interface HelixInstalledExtensionData extends HelixExtensionData {
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

/**
 * A list of extensions installed in a channel.
 */
@rtfm('api', 'HelixInstalledExtensionList')
export class HelixInstalledExtensionList {
	@Enumerable(false) private readonly _data: HelixInstalledExtensionListData;

	/** @private */
	constructor(data: HelixInstalledExtensionListData) {
		this._data = data;
	}

	getExtensionAtSlot(type: 'panel', slotId: '1' | '2' | '3'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: 'overlay', slotId: '1'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: 'component', slotId: '1' | '2'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: HelixExtensionSlotType, slotId: '1' | '2' | '3'): HelixInstalledExtension | null {
		const data = (this._data[type] as Record<'1' | '2' | '3', HelixExtensionSlotData>)[slotId];

		return data.active ? new HelixInstalledExtension(type, slotId, data) : null;
	}

	getExtensionsForSlotType(type: HelixExtensionSlotType): HelixInstalledExtension[] {
		return [...Object.entries(this._data[type])]
			.filter((entry): entry is [string, HelixInstalledExtensionData] => entry[1].active)
			.map(([slotId, slotData]) => new HelixInstalledExtension(type, slotId, slotData));
	}

	getAllExtensions(): HelixInstalledExtension[] {
		return ([...Object.entries(this._data)] as Array<
			[HelixExtensionSlotType, Record<'1' | '2' | '3', HelixExtensionSlotData>]
		>).flatMap(([type, typeEntries]) =>
			[...Object.entries(typeEntries)]
				.filter((entry): entry is [HelixExtensionSlotType, HelixInstalledExtensionData] => entry[1].active)
				.map(([slotId, slotData]) => new HelixInstalledExtension(type, slotId, slotData))
		);
	}
}
