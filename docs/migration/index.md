:::warning{title="Incomplete"}

This migration guide is currently a work in progress and not expected to be complete.  
It's still missing some crucial migration steps.

:::

## Install and import new packages

The packages were moved to a new NPM scope named `@twurple`. Here's the old and new packages for comparison:

| Old                             | New                       |
| ------------------------------- | ------------------------- |
| `easy-twitch-bot`               | `@twurple/easy-bot`       |
| `twitch`                        | `@twurple/api`            |
| `twitch-api-call`               | `@twurple/api-call`       |
| `twitch-auth`                   | `@twurple/auth`           |
| `twitch-auth-tmi`               | `@twurple/auth-tmi`       |
| `twitch-chat-client`            | `@twurple/chat`           |
| `twitch-common`                 | `@twurple/common`         |
| `twitch-electron-auth-provider` | `@twurple/auth-electron`  |
| `twitch-eventsub`               | `@twurple/eventsub`       |
| `twitch-eventsub-ngrok`         | `@twurple/eventsub-ngrok` |
| `twitch-pubsub-client`          | `@twurple/pubsub`         |
| `twitch-webhooks`               | *removed*                 |
| `twitch-webhooks-ngrok`         | *removed*                 |

## Switch from WebHooks to EventSub

The legacy WebHooks product was deprecated by Twitch and is going to be removed on September 16th.

The `@twurple/eventsub` package is very similar in usage to the old `twitch-webhooks` package.
Please check the [documentation on EventSub](/docs/getting-data/eventsub/listener-setup) for further information.

## Replace default imports with named imports

Default exports have been deprecated in 4.2 from all packages that had them. Their named counterparts have been added
at the same time and the docs have been encouraging their use ever since.

If your code was written for Twitch.js version 4.1 or lower, you might still have these default imports in your code,
and it's time to replace them now, as they're being removed.

```ts diff -1-3 +4-6
import ApiClient from 'twitch';
import ChatClient from 'twitch-chat-client';
import PubSubClient from 'twitch-pubsub-client';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { PubSubClient } from '@twurple/pubsub';
```
