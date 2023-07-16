Using a static token is pretty straightforward. Just pass your application's client ID and your token to {@link StaticAuthProvider}.

```ts twoslash
import { StaticAuthProvider } from '@twurple/auth';

const clientId = 'YOUR_CLIENT_ID';
const accessToken = 'YOUR_ACCESS_TOKEN';

const authProvider = new StaticAuthProvider(clientId, accessToken);
// As a minor optimization, you may pass the scopes of the token, but be sure they're correct in that case!
const authProvider2 = new StaticAuthProvider(clientId, accessToken, ['chat:read', 'chat:edit', 'channel:moderate']);
```
