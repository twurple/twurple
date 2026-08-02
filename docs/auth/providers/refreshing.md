For auto refreshing to work reliably, you need to persist your current access/refresh token pair and the token expiry
timestamp in some way.

:::warning{title="Don't use files in production"}

This example uses files to make it easily understandable, but you should probably use a database or similar,
especially if you need to fetch data for more than one user.

The complete object structure you want to reflect in your database is {@link AccessToken}.

:::

Created a file named `tokens.{USERID}.json`
(the `{USERID}` placeholder stands for the ID of the user the token was created for, without the braces)
with the following structure of data in it (also replace the placeholders here with your tokens):

```json
{
	"accessToken": "{INITIAL_ACCESS_TOKEN}",
	"refreshToken": "{INITIAL_REFRESH_TOKEN}",
	"expiresIn": 0,
	"obtainmentTimestamp": 0
}
```

Note that the expiry values are set to 0, which forces the application to make a refresh call the first time you start it.
This is done to prevent having to calculate the initial expiry timestamp manually.

```ts twoslash
// @module: esnext
// @target: ES2017
// @lib: es5
// silence TS complaining about fs not existing - TODO: might want to import node types somehow
// @errors: 2307
// ---cut---
import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fs } from 'fs';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'utf-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	}
);

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'utf-8'));

await authProvider.addUserForToken(tokenData);
```

If you already know the ID of the user you're adding, you can save a few internal requests by doing:

```ts
authProvider.addUser('125328655', tokenData);
```

## Getting the initial token using the Authorization Code Grant Flow

If you received an OAuth authorization code from Twitch's Authorization Code Grant Flow,
you can use the `exchangeCode` function to get a suitable {@link AccessToken} object:

```ts twoslash
// @module: esnext
// @target: ES2017
declare const req: { query: Record<string, string> };
declare const clientId: string;
declare const clientSecret: string;
// ---cut---
import { exchangeCode } from '@twurple/auth';

const code = req.query.code; // get it from wherever
const redirectUri = 'http://localhost'; // must match one of the URLs in the dev console exactly
const tokenData = await exchangeCode(clientId, clientSecret, code, redirectUri);
```

You can then add it to the provider:

```ts
await authProvider.addUserForToken(tokenData);
```

## Getting the initial token using Device Code Flow

Device Code Flow is useful for apps where opening a redirect server is inconvenient, such as desktop apps,
TV apps or command line tools.

For apps running on open platforms like Windows, macOS or Linux, you should generally use Device Code Flow as a public
client and avoid embedding a client secret in your application.

Unlike the Authorization Code Grant Flow, Device Code Flow sends the requested scopes to Twitch's device endpoints
instead of putting them in an authorization URL.
Use the same scopes when starting the flow and when exchanging the device code.

```ts twoslash
// @module: esnext
// @target: ES2017
declare const clientId: string;
// ---cut---
import { startDeviceCodeFlow } from '@twurple/auth';

const scopes = ['chat:read', 'chat:edit'];
const deviceInfo = await startDeviceCodeFlow(clientId, scopes);

console.log(`Go to ${deviceInfo.verificationUri} and enter ${deviceInfo.userCode}`);
```

After the user authorized your application, you can exchange the device code and add the resulting token to the provider:

```ts twoslash
// @module: esnext
// @target: ES2017
declare const clientId: string;
declare const deviceInfo: { deviceCode: string };
// ---cut---
import { exchangeDeviceCode, RefreshingAuthProvider } from '@twurple/auth';

const scopes = ['chat:read', 'chat:edit'];
const authProvider = new RefreshingAuthProvider({ clientId });

const tokenData = await exchangeDeviceCode(clientId, deviceInfo.deviceCode, scopes);
await authProvider.addUserForToken(tokenData, ['chat']);
```

Public-client refresh tokens returned by Device Code Flow are one-time-use and expire after 30 days of inactivity.
Always persist the newest token data from `onRefresh`, just like with other refreshing setups.
