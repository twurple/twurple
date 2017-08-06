import { Message, MessageParam, MessageParamSpec } from 'ircv3';

export interface UserNoticeParams {
	message: MessageParam;
}

// this command has no *useful* parameters, all information is in tags
export default class UserNotice extends Message<UserNoticeParams> {
	public static readonly COMMAND = 'ROOMSTATE';
	public static readonly PARAM_SPEC: MessageParamSpec<UserNoticeParams> = {
		message: {
			trailing: true
		}
	};
}
