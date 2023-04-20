/**
 * A part of a parsed message that represents plain text.
 */
export interface ParsedMessageTextPart {
	/**
	 * The type of the message part. This is text.
	 */
	type: 'text';

	/**
	 * The starting position of the text in the message, zero based.
	 */
	position: number;

	/**
	 * The length of the text in the message.
	 */
	length: number;

	/**
	 * The text.
	 */
	text: string;
}

/**
 * A part of a parsed message that represents a cheermote.
 */
export interface ParsedMessageCheerPart {
	/**
	 * The type of the message part. This is a cheermote.
	 */
	type: 'cheer';

	/**
	 * The name of the cheermote.
	 */
	name: string;

	/**
	 * The amount of bits for the cheermote.
	 */
	amount: number;

	/**
	 * The starting position of the cheermote in the message, zero based.
	 */
	position: number;

	/**
	 * The length of the cheermote in the message.
	 */
	length: number;
}

/**
 * A part of a parsed message that represents an emote.
 */
export interface ParsedMessageEmotePart {
	/**
	 * The type of the message part. This is an emote.
	 */
	type: 'emote';

	/**
	 * The starting position of the emote in the message, zero based.
	 */
	position: number;

	/**
	 * The length of the emote in the message.
	 */
	length: number;

	/**
	 * The ID of the emote.
	 */
	id: string;

	/**
	 * The name of the emote.
	 */
	name: string;
}

/**
 * A part of a parsed message.
 */
export type ParsedMessagePart = ParsedMessageTextPart | ParsedMessageCheerPart | ParsedMessageEmotePart;
