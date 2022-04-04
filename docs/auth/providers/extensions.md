Extension frontends already know a valid token at any time through Twitch's extension helper, and you can make use of it by installing:

	yarn add @twurple/auth-ext

or using npm:

	npm install @twurple/auth-ext
	
After that, all you need to provide is a client ID:

```ts twoslash
import { ExtensionAuthProvider } from '@twurple/auth-ext';

const clientId = 'YOUR_CLIENT_ID';
const authProvider = new ExtensionAuthProvider(clientId);
```
