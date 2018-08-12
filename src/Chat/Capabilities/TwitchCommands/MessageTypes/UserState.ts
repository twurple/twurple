import { Message, MessageParam, MessageParamSpec } from 'ircv3';

/** @private */
export interface UserStateParams {
	channel: MessageParam;
}

/** @private */
export default class UserState extends Message<UserStateParams> {
	public static readonly COMMAND = 'USERSTATE';
	public static readonly PARAM_SPEC: MessageParamSpec<UserStateParams> = {
		channel: {
			type: 'channel'
		}
	};
}
