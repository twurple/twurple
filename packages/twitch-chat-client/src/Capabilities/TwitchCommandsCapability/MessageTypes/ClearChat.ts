import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';

/** @private */
@MessageType('CLEARCHAT')
export class ClearChat extends Message<ClearChat> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	user!: MessageParam;
}
