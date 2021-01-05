/**
 * An inactive extensions slot.
 */
export interface HelixUserExtensionUpdatePayloadInactiveSlot {
	/**
	 * A flag indicating that the slot is inactive.
	 */
	active: false;
}

/**
 * An active extensions slot.
 */
export interface HelixUserExtensionUpdatePayloadActiveSlot {
	/**
	 * A flag indicating that the slot is active.
	 */
	active: true;
	/**
	 * The ID of the extension.
	 */
	id: string;
	/**
	 * The version of the extension.
	 */
	version?: string;
}

/**
 * An extension slot.
 */
export type HelixUserExtensionUpdatePayloadSlot =
	| HelixUserExtensionUpdatePayloadInactiveSlot
	| HelixUserExtensionUpdatePayloadActiveSlot;

/**
 * The whole payload of an user extension update.
 */
export interface HelixUserExtensionUpdatePayload {
	/**
	 * Panel slots to update.
	 */
	panel?: Partial<Record<'1' | '2' | '3', HelixUserExtensionUpdatePayloadSlot>>;

	/**
	 * Overlay slots to update.
	 */
	overlay?: Partial<Record<'1', HelixUserExtensionUpdatePayloadSlot>>;

	/**
	 * Component slots to update.
	 */
	component?: Partial<Record<'1' | '2', HelixUserExtensionUpdatePayloadSlot>>;
}
