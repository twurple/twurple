import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition } from 'ircv3';

/**
 * @private
 */
export class ClearMsg extends Message {
	static readonly COMMAND = 'CLEARMSG';

	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true
	})
	message!: MessageParam;

	get userName(): string {
		return this._tags.get('login')!;
	}

	get targetMessageId(): string {
		return this._tags.get('target-msg-id')!;
	}
}
