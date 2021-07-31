After you established a connection to the Twitch chat server, you can listen to events:

```ts twoslash
// @target: ES2017
// @lib: es2015,dom
import type { ApiClient } from '@twurple/api';
import type { ChatClient, PrivateMessage } from '@twurple/chat';
declare const apiClient: ApiClient;
declare const chatClient: ChatClient;
declare function secondsToDuration(secs: number): string;
declare module '@twurple/chat' {
	export class ChatClient {
		removeListener(listener: any): void; // required because inheritance from other packages doesn't properly work right now
	}
}
// ---cut---
const followAgeListener = chatClient.onMessage(async (channel: string, user: string, message: string, msg: PrivateMessage) => {
	if (message === '!followage') {
		const follow = await apiClient.users.getFollowFromUserToBroadcaster(msg.userInfo.userId, msg.channelId!);

		if (follow) {
			const currentTimestamp = Date.now();
			const followStartTimestamp = follow.followDate.getTime();
			chatClient.say(channel, `@${user} You have been following for ${secondsToDuration((currentTimestamp - followStartTimestamp) / 1000)}!`);
		} else {
			chatClient.say(channel, `@${user} You are not following!`);
		}
	}
});

// later, when you don't need this command anymore:
chatClient.removeListener(followAgeListener);
```

A list of all chat events can be found in the {@ChatClient} class reference.

:::warning{title="Why does my onConnect listener not work?"}

You should use `onRegister` to do things after the registration with the chat server finishes.

The `onConnect` event is fired before authentication and is therefore unlikely to be what you want since you can't send any messages at this point.

:::
