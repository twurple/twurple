import { Message, MessageParam, MessageParamSpec } from 'ircv3';

/** @private */
export interface UserStateParams {
	channel: MessageParam;
}

/** @private */
export default class RoomState extends Message<UserStateParams> {
	static readonly COMMAND = 'ROOMSTATE';
	static readonly PARAM_SPEC: MessageParamSpec<UserStateParams> = {
		channel: {
			type: 'channel'
		}
	};
}
