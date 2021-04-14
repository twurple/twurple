/// <reference lib="es2016.array.include" />

import { utf8Length } from '@d-fischer/shared-utils';

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
export interface MessageCheermote {
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
export enum CheermoteBackground {
	/**
	 * A dark background.
	 *
	 * Cheermotes might show artifacts on bright backgrounds.
	 */
	dark = 'dark',

	/**
	 * A bright background.
	 *
	 * Cheermotes might show artifacts on dark backgrounds.
	 */
	light = 'light'
}

/**
 * The state of a cheermote, i.e. whether it's animated or not.
 */
export enum CheermoteState {
	/**
	 * The cheermote should be animated.
	 */
	animated = 'animated',

	/**
	 * The cheermote should not be animated.
	 */
	static = 'static'
}

/**
 * The scale of the cheermote, which usually relates to the pixel density of the device in use.
 */
export enum CheermoteScale {
	/**
	 * The cheermote should not be scaled.
	 */
	x1 = '1',

	/**
	 * The cheermote should be scaled 1.5x.
	 */
	x1_5 = '1.5',

	/**
	 * The cheermote should be scaled 2x.
	 */
	x2 = '2',

	/**
	 * The cheermote should be scaled 3x.
	 */
	x3 = '3',

	/**
	 * The cheermote should be scaled 4x.
	 */
	x4 = '4'
}

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
export abstract class BaseCheermoteList {
	/**
	 * Gets the URL and color needed to properly represent a cheer of the given amount of bits with the given prefix.
	 *
	 * @param name The name/prefix of the cheermote.
	 * @param bits The amount of bits cheered.
	 * @param format The format of the cheermote you want to request.
	 */
	abstract getCheermoteDisplayInfo(
		name: string,
		bits: number,
		format?: Partial<CheermoteFormat>
	): CheermoteDisplayInfo;

	/**
	 * Gets all possible cheermote names.
	 */
	abstract getPossibleNames(): string[];

	/**
	 * Parses all the cheermotes out of a message.
	 *
	 * @param message The message.
	 */
	parseMessage(message: string): MessageCheermote[] {
		const result: MessageCheermote[] = [];

		const names = this.getPossibleNames();
		const re = new RegExp('(?<=^|\\s)([a-z0-9]+?)(\\d+)(?=\\s|$)', 'gi');
		let match: RegExpExecArray | null = null;
		while ((match = re.exec(message))) {
			const name = match[1].toLowerCase();
			if (names.includes(name)) {
				const amount = Number(match[2]);
				result.push({
					name,
					amount,
					position: utf8Length(message.substr(0, match.index)),
					length: match[0].length,
					displayInfo: this.getCheermoteDisplayInfo(name, amount)
				});
			}
		}

		return result;
	}

	/**
	 * Transforms all the cheermotes in a message and returns an array of all the message parts.
	 *
	 * @param message The message.
	 * @param transformer A function that transforms a message part into an arbitrary structure.
	 */
	transformCheerMessage<T>(
		message: string,
		transformer: (displayInfo: MessageCheermote) => string | T
	): Array<string | T> {
		const result: Array<string | T> = [];

		let currentPosition = 0;
		for (const foundCheermote of this.parseMessage(message)) {
			if (currentPosition < foundCheermote.position) {
				result.push(message.substring(currentPosition, foundCheermote.position));
			}
			result.push(transformer(foundCheermote));
			currentPosition = foundCheermote.position + foundCheermote.length;
		}

		if (currentPosition < message.length) {
			result.push(message.substr(currentPosition));
		}

		return result;
	}
}
