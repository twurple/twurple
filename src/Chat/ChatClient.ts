import {Client as IRCClient} from 'ircv3';

export default class ChatClient {
	private _ircClient: IRCClient;

	constructor(private _username: string, token: string) {
		this._ircClient = new IRCClient({
			connection: {
				hostName: 'irc-ws.chat.twitch.tv',
				nick: this._username.toLowerCase(),
				password: `oauth:${token}`
			},
			webSocket: true
		});
	}

	connect() {
		this._ircClient.connect();
	}
}
