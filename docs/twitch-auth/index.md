Welcome to the documentation of the Authentication module of Twitch.js, a library for NodeJS and the browser that aims to provide an easy interface
to all of Twitch's programmatically available features.

Please feel free to browse the menu on the left to get started with the library and to check out all the different available classes.

## Installation

To add Twitch.js and the WebHook listener to your project, just execute:

	yarn add twitch-auth

or using npm:

	npm install twitch-auth

## Setting up authentication

You can choose between different ways to authenticate:

- To only ever use a single token determined at instantiation time, check out [Using a fixed token](/twitch-auth/docs/providers/static).
- If you want to run something more long-term, you may be interested in [auto-refreshing tokens](/twitch-auth/docs/providers/refreshable).
- If you run an application that doesn't need user-specific data, you can use [app tokens](/twitch-auth/docs/providers/client-credentials).
- If you are building an Electron app, you can use our premade [Electron auth provider](/twitch-auth/docs/providers/electron).
- If you have special requirements, you can write your own provider by following the {@AuthProvider} interface.

## If you're getting stuck...

You can join the [Discord Server](https://discord.gg/b9ZqMfz) for support.
