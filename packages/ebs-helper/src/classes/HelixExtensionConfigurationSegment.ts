import { DataObject, rawDataSymbol } from '@twurple/common';

export type HelixExtensionConfigurationSegmentName = 'global' | 'broadcaster' | 'developer';

export interface HelixExtensionConfigurationSegmentData {
	segment: HelixExtensionConfigurationSegmentName;
	content: string;
	version: string;
}

export class HelixExtensionConfigurationSegment extends DataObject<HelixExtensionConfigurationSegmentData> {
	get segmentName(): HelixExtensionConfigurationSegmentName {
		return this[rawDataSymbol].segment;
	}

	get content(): string {
		return this[rawDataSymbol].content;
	}

	get version(): string {
		return this[rawDataSymbol].version;
	}
}
