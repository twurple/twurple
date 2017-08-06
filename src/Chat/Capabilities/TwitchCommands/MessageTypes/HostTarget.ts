import { Message, MessageParam, MessageParamSpec } from 'ircv3';

export interface HostTargetParams {
	channel: MessageParam;
	targetAndViewers: MessageParam;
}

// this command has no *useful* parameters, all information is in tags
export default class HostTarget extends Message<HostTargetParams> {
	public static readonly COMMAND = 'HOSTTARGET';
	public static readonly PARAM_SPEC: MessageParamSpec<HostTargetParams> = {
		channel: {
			type: 'channel'
		},
		targetAndViewers: {
			trailing: true
		}
	};
}
