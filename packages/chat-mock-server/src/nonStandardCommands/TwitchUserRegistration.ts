import { Message, type MessageParam, MessageParamDefinition, MessageType } from 'ircv3';

@MessageType('USER')
export class TwitchUserRegistration extends Message<TwitchUserRegistration> {
	@MessageParamDefinition({
		rest: true
	})
	allParams!: MessageParam;
}
