When someone gifts a batch of subscriptions to a channel, this sends one `onCommunitySub` event
followed by one `onSubGift` event for each subscription that was gifted.

If you're writing an alert system or you're replying to each gift in chat,
this can quickly lead to spam and rate limit violations.

Here's a helpful snippet that can help with this: 

```ts twoslash
// @module: esnext
// @target: esnext
// @lib: es2015
import { ChatClient } from 'twitch-chat-client';
declare const chatClient: ChatClient;
// ---cut---
// adding undefined as possible key because of anonymous gifts
const giftCounts = new Map<string | undefined, number>();

chatClient.onCommunitySub((channel, user, subInfo) => {
  const previousGiftCount = giftCounts.get(user) ?? 0;
  giftCounts.set(user, previousGiftCount + subInfo.count);
  chatClient.say(channel, `Thanks ${user} for gifting ${subInfo.count} subs to the community!`);
});

chatClient.onSubGift((channel, recipient, subInfo) => {
  const user = subInfo.gifter;
  const previousGiftCount = giftCounts.get(user) ?? 0;
  if (previousGiftCount > 0) {
    giftCounts.set(user, previousGiftCount - 1);
  } else {
    chatClient.say(channel, `Thanks ${user} for gifting a sub to ${recipient}!`);
  }
});
```
