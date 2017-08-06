import { Message, MessageParam, MessageParamSpec } from 'ircv3';

export interface UserStateParams {
	channel: MessageParam;
}

export default class UserState extends Message<UserStateParams> {
	public static readonly COMMAND = 'USERSTATE';
	public static readonly PARAM_SPEC: MessageParamSpec<UserStateParams> = {
		channel: {
			type: 'channel'
		}
	};
}
