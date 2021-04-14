import type { ChatClient, PrivateMessage } from '@twurple/chat';

export class BotCommandContext {
	readonly user: string;
	readonly channel: string;

	/** @private **/
	constructor(private readonly _client: ChatClient, public readonly msg: PrivateMessage) {
		this.user = msg.userInfo.userName;
		this.channel = msg.params.target;
	}

	say = async (message: string): Promise<void> => this._client.say(this.msg.params.target, message);
}
