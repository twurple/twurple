The first thing you do is create an authentication provider. The easiest way to get one is to supply static credentials. From that, you can create your Twitch API client.

```ts twoslash
import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';

const clientId = '123abc';
const accessToken = 'def456';
const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });
```

You can also have the client refresh the tokens automatically if necessary by wrapping it in a {@RefreshableAuthProvider} with the necessary data:

```ts twoslash
import { ApiClient } from '@twurple/api';
import { AccessToken, RefreshableAuthProvider, StaticAuthProvider } from '@twurple/auth';

const clientId = '123abc';
const accessToken = 'def456';
const clientSecret = 'foobar';
const refreshToken = '999999';
const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
        clientSecret,
        refreshToken,
        onRefresh: (token: AccessToken) => {
	        // do things with the new token data, e.g. save them in your database
        }
    }
);
const apiClient = new ApiClient({ authProvider });
```

There's a more elaborated example on how to make auto refreshing work in the [@twurple/chat documentation](/chat/docs/examples/basic-bot).

If you don't need any user scopes, you may also create the client using client credentials:

```ts twoslash
import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';

const clientId = '123abc';
const clientSecret = 'foobar';
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });
```

The following sections assume that you have created an `apiClient` already.
