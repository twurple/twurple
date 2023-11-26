When someone gifts a batch of subscriptions to a channel, this sends one `onCommunitySub` event
followed by one `onSubGift` event for each subscription that was gifted.

If you're writing an alert system or you're replying to each gift in chat,
this can quickly lead to spam and rate limit violations.

Here's a helpful snippet that can help with this for `@twurple/chat`:

```ts twoslash
// @module: esnext
// @target: esnext
// @lib: es2015
import { ChatClient } from '@twurple/chat';
declare const chatClient: ChatClient;
// ---cut---
// undefined is a possible key because of anonymous gifts
const giftCounts = new Map<string | undefined, number>();

chatClient.onCommunitySub((channel, gifterName, giftInfo) => {
	const previousGiftCount = giftCounts.get(gifterName) ?? 0;
	giftCounts.set(gifterName, previousGiftCount + giftInfo.count);
	chatClient.say(channel, `Thanks ${gifterName} for gifting ${giftInfo.count} subs to the community!`);
});

chatClient.onSubGift((channel, recipientName, subInfo) => {
	const gifterName = subInfo.gifter;
	const previousGiftCount = giftCounts.get(gifterName) ?? 0;
	if (previousGiftCount > 0) {
		giftCounts.set(gifterName, previousGiftCount - 1);
	} else {
		chatClient.say(channel, `Thanks ${gifterName} for gifting a sub to ${recipientName}!`);
	}
});
```

If you use `@twurple/easy-bot`, the required information is included in the event object:

```ts twoslash
// @module: esnext
// @target: esnext
// @lib: es2015
import { Bot } from '@twurple/easy-bot';
declare const bot: Bot;
// ---cut---
bot.onCommunitySub(e => {
	const { channel, gifterName, count } = e;
	// ...
});

bot.onSubGift(e => {
	const { broadcasterName: channel, userName: recipientName, gifterName } = e;
	// ...
});
```
