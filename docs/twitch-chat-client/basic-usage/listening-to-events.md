After you established a connection to the Twitch chat server and joined at least one channel, you can listen to events:

```typescript
const followAgeListener = chatClient.onPrivmsg(async (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => {
	if (message === '!followage') {
		const follow = await apiClient.kraken.users.getFollowedChannel(msg.userInfo.userId, msg.channelId);

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

A list of all chat events can be found in the {@ChatClient} documentation.
