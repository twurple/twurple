## Installation

To add WebHook support to your project, you need three packages:

- `@twurple/auth`, the authentication core
- `@twurple/api`, the API client
- `@twurple/webhooks`, the actual WebHook listener

To install these, just execute:

	yarn add @twurple/auth @twurple/api @twurple/webhooks

or using npm:

	npm install @twurple/auth @twurple/api @twurple/webhooks

## Importing the library

Using ES2015 modules:

```typescript
import { WebHookListener } from '@twurple/webhooks';
```

Using CommonJS:

```typescript
const { WebHookListener } = require('@twurple/webhooks');
```

