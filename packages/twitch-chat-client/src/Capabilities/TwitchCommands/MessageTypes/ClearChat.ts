import { Message, MessageParam, MessageParamSpec } from 'ircv3';

/** @private */
export interface ClearChatParams {
	channel: MessageParam;
	user: MessageParam;
}

/** @private */
export default class ClearChat extends Message<ClearChatParams> {
	static readonly COMMAND = 'CLEARCHAT';
	static readonly PARAM_SPEC: MessageParamSpec<ClearChat> = {
		channel: {
			type: 'channel'
		},
		user: {
			trailing: true,
			optional: true
		}
	};
}
