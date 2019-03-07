## Installation

To add Twitch.js and the PubSub client to your project, just execute:

	yarn add twitch twitch-pubsub-client

or using npm:

	npm install --save twitch twitch-pubsub-client

## Importing the library

There are two different clients available to import. One is specialized to listening to events for a single channel/user, the other one is more low-level.
Just remove the class you don't need.

Using ES2015 modules:

```typescript
import { PubSubClient, SingleUserPubSubClient } from 'twitch-pubsub-client';
```

Using CommonJS modules:

```typescript
const PubSubClient = require('twitch-pubsub-client').PubSubClient;
const SingleUserPubSubClient = require('twitch-pubsub-client').SingleUserPubSubClient;
```
