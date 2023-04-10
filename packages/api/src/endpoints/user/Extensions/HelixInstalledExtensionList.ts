import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type HelixExtensionSlotData,
	type HelixExtensionSlotType,
	type HelixInstalledExtensionData,
	type HelixInstalledExtensionListData
} from '../../../interfaces/endpoints/userExtension.external';
import { HelixInstalledExtension } from './HelixInstalledExtension';

/**
 * A list of extensions installed in a channel.
 */
@rtfm('api', 'HelixInstalledExtensionList')
export class HelixInstalledExtensionList extends DataObject<HelixInstalledExtensionListData> {
	getExtensionAtSlot(type: 'panel', slotId: '1' | '2' | '3'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: 'overlay', slotId: '1'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: 'component', slotId: '1' | '2'): HelixInstalledExtension | null;
	getExtensionAtSlot(type: HelixExtensionSlotType, slotId: '1' | '2' | '3'): HelixInstalledExtension | null {
		const data = (this[rawDataSymbol][type] as Record<'1' | '2' | '3', HelixExtensionSlotData>)[slotId];

		return data.active ? new HelixInstalledExtension(type, slotId, data) : null;
	}

	getExtensionsForSlotType(type: HelixExtensionSlotType): HelixInstalledExtension[] {
		return [...Object.entries(this[rawDataSymbol][type])]
			.filter((entry): entry is [string, HelixInstalledExtensionData] => entry[1].active)
			.map(([slotId, slotData]) => new HelixInstalledExtension(type, slotId, slotData));
	}

	getAllExtensions(): HelixInstalledExtension[] {
		return (
			[...Object.entries(this[rawDataSymbol])] as Array<
				[HelixExtensionSlotType, Record<'1' | '2' | '3', HelixExtensionSlotData>]
			>
		).flatMap(([type, typeEntries]) =>
			[...Object.entries(typeEntries)]
				.filter((entry): entry is [HelixExtensionSlotType, HelixInstalledExtensionData] => entry[1].active)
				.map(([slotId, slotData]) => new HelixInstalledExtension(type, slotId, slotData))
		);
	}
}
