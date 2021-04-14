To automatically get app access tokens for use in your applications, just pass your application's client ID and client secret to {@ClientCredentialsAuthProvider}.

```ts twoslash
import { ClientCredentialsAuthProvider } from '@twurple/auth';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
```
