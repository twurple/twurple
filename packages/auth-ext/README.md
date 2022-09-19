# Twurple - Extension auth provider

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/auth-ext.svg?style=flat)](https://www.npmjs.com/package/@twurple/auth-ext)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

This is an {@link AuthProvider} implementation for [the `twurple` package family](https://github.com/twurple/twurple)
that will use the token provided to your Extension by Twitch.

## Installation

To add this library to your project, just execute:

	yarn add @twurple/auth-ext

or using npm:

	npm install @twurple/auth-ext

## Basic usage

To instantiate an {@link ApiClient} with this auth provider, just pass it to its constructor:

```ts
import { ApiClient } from '@twurple/api';
import { ExtensionAuthProvider } from '@twurple/auth-ext';

const clientId = 'abc123';

const authProvider = new ExtensionAuthProvider(clientId);

const client = new ApiClient({
	authProvider
});
```

## If you're getting stuck...

You can join the [Twitch API Libraries Discord Server](https://discord.gg/b9ZqMfz) and ask in `#twurple` for support.
