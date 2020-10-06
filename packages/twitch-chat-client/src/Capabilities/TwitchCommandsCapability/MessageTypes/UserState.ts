import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';

/** @private */
@MessageType('USERSTATE')
export class UserState extends Message<UserState> {
	@MessageParamDefinition({
		type: 'channel'
	})
	type!: MessageParam;
}
