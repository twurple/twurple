/** @private */
export interface HelixExtensionSecretData {
	content: string;
	active_at: string;
	expires_at: string;
}

/** @private */
export interface HelixExtensionSecretListData {
	format_version: number;
	secrets: HelixExtensionSecretData[];
}
