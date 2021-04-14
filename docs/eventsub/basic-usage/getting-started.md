## Installation

To add EventSub support to your project, you need three packages:

- `@twurple/auth`, the authentication core
- `@twurple/api`, the API client
- `@twurple/eventsub`, the actual EventSub listener

To install these, just execute:

	yarn add @twurple/auth @twurple/api @twurple/eventsub

or using npm:

	npm install @twurple/auth @twurple/api @twurple/eventsub

## Importing the library

Using ES2015 modules:

```typescript
import { EventSubListener } from '@twurple/eventsub';
```

Using CommonJS:

```typescript
const { EventSubListener } = require('@twurple/eventsub');
```

