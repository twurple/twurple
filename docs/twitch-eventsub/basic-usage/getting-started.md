## Installation

To add EventSub support to your project, you need three packages:

- `twitch-auth`, the authentication core
- `twitch`, the API client
- `twitch-eventsub`, the actual EventSub listener

To install these, just execute:

	yarn add twitch twitch-auth twitch-eventsub

or using npm:

	npm install --save twitch twitch-auth twitch-eventsub

## Importing the library

Using ES2015 modules:

```typescript
import { EventSubListener } from 'twitch-eventsub';
```

Using CommonJS:

```typescript
const { EventSubListener } = require('twitch-eventsub');
```

