# Twitch.js - Bot framework

A simplified framework to get a chat bot running easily.

## Installation

	yarn add easy-twitch-bot

or using npm:

	npm install easy-twitch-bot

## Example

```typescript
import { Bot, createBotCommand } from 'easy-twitch-bot';
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
