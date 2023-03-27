# Twurple - Bot framework

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/twurple/twurple/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@twurple/easy-bot.svg?style=flat)](https://www.npmjs.com/package/@twurple/easy-bot)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A simplified framework to get a chatbot running easily.

## Installation

	yarn add @twurple/easy-bot

or using npm:

	npm install @twurple/easy-bot

## Example

```typescript
import { Bot, createBotCommand } from '@twurple/easy-bot';

const bot = new Bot(null, {
	authProvider,
	channel: 'satisfiedpear',
	commands: [
		createBotCommand('d20', async (params, { user, say, timeout }) => {
			const diceRoll = Math.floor(Math.random() * 20) + 1;
			if (diceRoll === 1) {
				await say(`@${user} rolled a critical failure and must be punished!`);
				await timeout(30, 'critical failure');
			} else if (diceRoll === 20) {
				await say(`Woah, critical success! @${user} deserves all the praise!`);
			} else {
				await say(`@${user} rolled a ${diceRoll}!`);
			}
		})
	]
});
```
