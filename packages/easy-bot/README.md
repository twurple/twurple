# ⚠ WARNING

This is a future version still in development. For a stable version, check out [the `easy-twitch-bot` package](https://www.npmjs.com/package/easy-twitch-bot).

# Twurple - Bot framework

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/easy-bot.svg?style=flat)](https://www.npmjs.com/package/@twurple/easy-bot)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A simplified framework to get a chat bot running easily.

## Installation

	yarn add @twurple/easy-bot

or using npm:

	npm install @twurple/easy-bot

## Example

```typescript
import { Bot, createBotCommand } from '@twurple/easy-bot';
Bot.create({
    auth: 'YOURTOKENHERE',
    channel: 'satisfiedpear',
    commands: [
        createBotCommand('dice', (params, { user, say }) => {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            say(`@${user} rolled a ${diceRoll}`);
        })
    ]
});
```
