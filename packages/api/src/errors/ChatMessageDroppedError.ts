import { CustomError } from '@twurple/common';

/**
 * Thrown when a chat message is dropped and not delivered to the target channel.
 */
export class ChatMessageDroppedError extends CustomError {
	private readonly _code: string | undefined;

	constructor(broadcasterId: string, message: string | undefined, code: string | undefined) {
		super(`Chat message to channel ${broadcasterId} dropped: ${message ?? 'unknown reason'}`);
		this._code = code;
	}

	get code(): string | undefined {
		return this._code;
	}
}
