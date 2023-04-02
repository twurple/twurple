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
const followAgeListener = chatClient.onMessage(async (channel: string, user: string, text: string, msg: PrivateMessage) => {
	if (message === '!followage') {
		const broadcasterId = msg.channelId!;
		const { data: [follow] } = await apiClient.channels.getChannelFollowers(broadcasterId, broadcasterId, msg.userInfo.userId);

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

A list of all chat events can be found in the {@link ChatClient} class reference.

:::warning{title="Why do actions right after the `connect()` call not work?"}

You should use `onAuthenticationSuccess` to do things after the registration with the chat server finishes.

The `connect()` method finishes before authentication and is therefore unlikely to be what you want since you can't send any messages at this point.

:::
