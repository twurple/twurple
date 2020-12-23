import type { ChatClient, PrivateMessage } from 'twitch-chat-client';

export class BotCommandContext {
	readonly user: string;
	readonly channel: string;

	/** @private **/
	constructor(private readonly _client: ChatClient, public readonly msg: PrivateMessage) {
		this.user = msg.userInfo.userName;
		this.channel = msg.params.target;
	}

	say = (message: string): void => {
		this._client.say(this.msg.params.target, message);
	};
}
