import ChatClient, { PrivateMessage } from 'twitch-chat-client';

export default class BotCommandContext {
	readonly user: string;
	readonly channel: string;

	/** @private **/
	constructor(private _client: ChatClient, public readonly msg: PrivateMessage) {
		this.user = msg.userInfo.userName;
		this.channel = msg.params.target;
	}

	say = (message: string) => {
		this._client.say(this.msg.params.target, message);
	};
}
