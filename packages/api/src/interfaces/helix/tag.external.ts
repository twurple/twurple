/** @private */
export interface HelixTagData {
	tag_id: string;
	is_auto: boolean;
	localization_names: Record<string, string>;
	localization_descriptions: Record<string, string>;
}
