import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';

// this command has no *useful* parameters, all information is in tags
/** @private */
@MessageType('HOSTTARGET')
export class HostTarget extends Message<HostTarget> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true
	})
	targetAndViewers!: MessageParam;
}
