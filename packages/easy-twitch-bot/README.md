# Twurple - Bot framework

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
