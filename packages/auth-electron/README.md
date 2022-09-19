# Twurple - Electron auth provider

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/auth-electron.svg?style=flat)](https://www.npmjs.com/package/@twurple/auth-electron)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

This is an {@link AuthProvider} implementation for [the `twurple` package family](https://github.com/twurple/twurple)
that will automatically pop up a Twitch OAuth dialog in an Electron `BrowserWindow`
as soon as new scopes are requested.

## Installation

To add this library to your project, just execute:
	
	yarn add @twurple/auth-electron

or using npm:

	npm install @twurple/auth-electron

## Basic usage

To instantiate an {@link ApiClient} with this auth provider, just pass it to its constructor:

```ts
import { ApiClient } from '@twurple/api';
import { ElectronAuthProvider } from '@twurple/auth-electron';

const clientId = 'abc123';
const redirectUri = 'http://foo.bar/login';

const authProvider = new ElectronAuthProvider({
    clientId,
    redirectUri
});

const client = new ApiClient({
	authProvider
});
```

Please note that this currently only works from the *main thread*.

To allow the user to "log out" and change to another account, use:

```ts
authProvider.allowUserChange();
```

## If you're getting stuck...

You can join the [Twitch API Libraries Discord Server](https://discord.gg/b9ZqMfz) and ask in `#twurple` for support.
