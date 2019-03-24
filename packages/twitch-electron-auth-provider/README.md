# Twitch.js - Electron auth provider

This aims to be an auth provider for [the `twitch` package](https://github.com/d-fischer/twitch)
that will automatically pop up a Twitch OAuth dialog in an Electron `BrowserWindow`
as soon as new scopes are requested.

## Installation

To add this library to your project, just execute:
	
	yarn add twitch-electron-auth-provider

or using npm:

	npm install twitch-electron-auth-provider

## Basic usage

To instantiate a TwitchClient with this auth provider, just pass it to its constructor:

```ts
import TwitchClient from 'twitch';
import ElectronAuthProvider from 'twitch-electron-auth-provider';

const clientId = 'abc123';
const redirectURI = 'http://foo.bar/login';

const client = new TwitchClient({
	authProvider: new ElectronAuthProvider({
		clientId,
		redirectURI
	})
});
```

Please not that this currently only works from the *main thread*.

## If you're getting stuck...

You can join the [Discord server](https://discord.gg/b9ZqMfz) for support.
