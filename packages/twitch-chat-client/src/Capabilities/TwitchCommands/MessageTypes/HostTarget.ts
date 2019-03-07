import { Message, MessageParam, MessageParamSpec } from 'ircv3';

/** @private */
export interface HostTargetParams {
	channel: MessageParam;
	targetAndViewers: MessageParam;
}

// this command has no *useful* parameters, all information is in tags
/** @private */
export default class HostTarget extends Message<HostTargetParams> {
	static readonly COMMAND = 'HOSTTARGET';
	static readonly PARAM_SPEC: MessageParamSpec<HostTarget> = {
		channel: {
			type: 'channel'
		},
		targetAndViewers: {
			trailing: true
		}
	};
}
