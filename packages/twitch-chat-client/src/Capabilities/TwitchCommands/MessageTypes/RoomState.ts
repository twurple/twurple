import { Message, MessageParam, MessageParamSpec } from 'ircv3';

/** @private */
export interface RoomStateParams {
	channel: MessageParam;
}

/** @private */
export default class RoomState extends Message<RoomStateParams> {
	static readonly COMMAND = 'ROOMSTATE';
	static readonly PARAM_SPEC: MessageParamSpec<RoomState> = {
		channel: {
			type: 'channel'
		}
	};
}
