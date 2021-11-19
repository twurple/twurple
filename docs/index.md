Twurple is a set of libraries that aims to cover all of the existing Twitch APIs.

- Query the Helix API
- Build a chat bot
- React to custom redemptions, subscriptions, follows and much more using PubSub and EventSub
- Do all this without caring about the expiry of your access tokens - **we can refresh them automatically**

## Installation

Twurple consists of multiple packages that mostly communicate with a single system on Twitch's side.

All these system packages rely on a single package that manages authentication tokens, `@twurple/auth`.  
All peer dependencies between the different packages are shown here:

| Package             | Peer dependencies                |
| ------------------- | -------------------------------- |
| `@twurple/api`      | `@twurple/auth`                  |
| `@twurple/chat`     | `@twurple/auth`                  |
| `@twurple/eventsub` | `@twurple/auth`, `@twurple/api`  |
| `@twurple/pubsub`   | `@twurple/auth`                  |

For example, to use EventSub, execute one of:
```bash
yarn add @twurple/auth @twurple/api @twurple/eventsub
# or
npm install @twurple/auth @twurple/api @twurple/eventsub
```

## I got stuck/have more questions! Where do I get help?

You can join the [Twitch API Libraries Discord Server](https://discord.gg/b9ZqMfz) and ask in `#twurple` for support.
