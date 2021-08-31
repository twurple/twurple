# ⚠ WARNING

This is a future version still in development. For a stable version, check out [the `versions/4.6` branch](https://github.com/twurple/twurple/tree/versions/4.6).

# Twurple

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/auth.svg?style=flat)](https://www.npmjs.com/package/@twurple/auth)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A set of libraries that aims to cover all of the existing Twitch APIs.

- Query the Helix API
- Build a chat bot
- React to custom redemptions, subscriptions, follows and much more using PubSub and EventSub
- Do all this without caring about the expiry of your access tokens - **we can refresh them automatically**

## Installation

To add Twurple to your project, just execute:

	yarn add @twurple/auth

or using npm:

	npm install @twurple/auth

## Documentation

A good place to start with this library is the [documentation](https://twurple.js.org)
which also includes a complete reference of all classes and interfaces, as well as changes and deprecations between major versions.

## Additional packages

The mentioned `@twurple/auth` package only provides authentication functionality. All the other things are located in separate packages:

- [@twurple/api](https://npmjs.com/package/@twurple/api) - make calls to the Helix API
- [@twurple/chat](https://npmjs.com/package/@twurple/chat) - connect to and interact with Twitch Chat
- [@twurple/pubsub](https://npmjs.com/package/@twurple/pubsub) - listen to events using the Twitch PubSub interface
- [@twurple/eventsub](https://npmjs.com/package/@twurple/eventsub) - listen to events using EventSub

## If you're getting stuck...

You can join the [Discord server](https://discord.gg/b9ZqMfz) for support.

## Special thanks

- [discord.js](https://discord.js.org) for major inspiration on the structure of the libraries (or, as it was back then, *the library*)
- [All the people who contributed to Twurple](https://github.com/twurple/twurple/graphs/contributors)
- My [sponsors](https://github.com/sponsors/d-fischer) (maybe you want to become one too?)
