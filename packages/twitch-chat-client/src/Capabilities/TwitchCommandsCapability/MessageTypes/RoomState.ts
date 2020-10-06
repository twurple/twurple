import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';

/** @private */
@MessageType('ROOMSTATE')
export class RoomState extends Message<RoomState> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;
}
