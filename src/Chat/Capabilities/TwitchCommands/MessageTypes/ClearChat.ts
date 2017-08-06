import { Message, MessageParam, MessageParamSpec } from 'ircv3';

export interface ClearChatParams {
	channel: MessageParam;
	user: MessageParam;
}

export default class ClearChat extends Message<ClearChatParams> {
	public static readonly COMMAND = 'CLEARCHAT';
	public static readonly PARAM_SPEC: MessageParamSpec<ClearChatParams> = {
		channel: {
			type: 'channel'
		},
		user: {
			trailing: true,
			optional: true
		}
	};
}
