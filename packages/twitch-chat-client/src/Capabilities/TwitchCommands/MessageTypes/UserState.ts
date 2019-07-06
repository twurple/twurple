import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';

/** @private */
@MessageType('USERSTATE')
export default class UserState extends Message<UserState> {
	@MessageParamDefinition({
		type: 'channel'
	})
	type!: MessageParam;
}
