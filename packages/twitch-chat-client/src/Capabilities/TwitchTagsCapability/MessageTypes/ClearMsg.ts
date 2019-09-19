import { Message, MessageParam, MessageParamDefinition } from 'ircv3';

/**
 * @private
 */
export default class ClearMsg extends Message {
	static readonly COMMAND = 'CLEARMSG';

	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true
	})
	message!: MessageParam;

	get userName() {
		return this._tags.get('login')!;
	}

	get targetMessageId() {
		return this._tags.get('target-msg-id');
	}
}
