In some cases you don't have access to any user access tokens.
In that case, just pass your application's client ID and client secret to {@link AppTokenAuthProvider}.

```ts twoslash
import { AppTokenAuthProvider } from '@twurple/auth';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
```
