## Installation

To add Twitch.js and the PubSub client to your project, just execute:

	yarn add twitch twitch-pubsub-client

or using npm:

	npm install --save twitch twitch-pubsub-client

## Importing the library

Most of the time, you only to import need the {@PubSubClient} class.

Using ES2015 modules:

```typescript
import { PubSubClient } from 'twitch-pubsub-client';
```

Using CommonJS modules:

```typescript
const PubSubClient = require('twitch-pubsub-client').PubSubClient;
```
