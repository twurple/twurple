/**
 * The type of background a cheermote is supposed to appear on.
 *
 * We will supply a fitting graphic that does not show any artifacts
 * on the given type of background.
 */
export type CheermoteBackground = 'dark' | 'light';

/**
 * The state of a cheermote, i.e. whether it's animated or not.
 */
export type CheermoteState = 'animated' | 'static';

/**
 * The scale of the cheermote, which usually relates to the pixel density of the device in use.
 */
export type CheermoteScale = '1' | '1.5' | '2' | '3' | '4';

/**
 * The format of the cheermote you want to request.
 */
export interface CheermoteFormat {
	/**
	 * The desired background for the cheermote.
	 */
	background: CheermoteBackground;

	/**
	 * The desired cheermote state.
	 */
	state: CheermoteState;

	/**
	 * The desired cheermote scale.
	 */
	scale: CheermoteScale;
}

/**
 * The details on how a cheermote should be displayed.
 */
export interface CheermoteDisplayInfo {
	/**
	 * The URL of the image that should be shown.
	 */
	url: string;

	/**
	 * The color that should be used to show the cheer amount.
	 *
	 * This is a hexadecimal color value, e.g. `#9c3ee8`.
	 */
	color: string;
}
