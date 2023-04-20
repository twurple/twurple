import { DataObject } from '../DataObject';

/**
 * The details on how a cheermote should be displayed.
 */
export interface CheermoteDisplayInfo {
	/**
	 * The URL of the image that should be shown.
	 */
	url: string;

	/**
	 * The color that should be used to shown the cheer amount.
	 *
	 * This is a hexadecimal color value, e.g. `#9c3ee8`.
	 */
	color: string;
}

/**
 * A description of a specific cheermote parsed from a message.
 */
export interface BasicMessageCheermote {
	/**
	 * The name of the cheermote.
	 */
	name: string;

	/**
	 * The amount of bits for the cheermote.
	 */
	amount: number;

	/**
	 * The position of the cheermote in the text, zero based.
	 */
	position: number;

	/**
	 * The length of the cheermote in the text.
	 */
	length: number;
}

/**
 * A description of a specific cheermote parsed from a message with info how to display it.
 *
 * @inheritDoc
 */
export interface MessageCheermote extends BasicMessageCheermote {
	/**
	 * Information on how the cheermote is supposed to be displayed.
	 */
	displayInfo: CheermoteDisplayInfo;
}

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

/** @private */
export abstract class BaseCheermoteList<DataType> extends DataObject<DataType> {
	/**
	 * Gets the URL and color needed to properly represent a cheer of the given amount of bits with the given prefix.
	 *
	 * @param name The name/prefix of the cheermote.
	 * @param bits The amount of bits cheered.
	 * @param format The format of the cheermote you want to request.
	 */
	abstract getCheermoteDisplayInfo(name: string, bits: number, format: CheermoteFormat): CheermoteDisplayInfo;

	/**
	 * Gets all possible cheermote names.
	 */
	abstract getPossibleNames(): string[];
}
