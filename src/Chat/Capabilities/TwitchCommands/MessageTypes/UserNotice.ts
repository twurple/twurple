import { Message, MessageParam, MessageParamSpec } from 'ircv3';

export interface UserNoticeParams {
	channel: MessageParam;
	message: MessageParam;
}

export default class UserNotice extends Message<UserNoticeParams> {
	public static readonly COMMAND = 'USERNOTICE';
	public static readonly PARAM_SPEC: MessageParamSpec<UserNoticeParams> = {
		channel: {
			type: 'channel'
		},
		message: {
			trailing: true
		}
	};
}
