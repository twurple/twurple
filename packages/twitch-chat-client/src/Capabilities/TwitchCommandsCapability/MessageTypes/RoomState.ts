import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';

/** @private */
@MessageType('ROOMSTATE')
export class RoomState extends Message<RoomState> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;
}
