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
const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
	}
);

await authProvider.addUserForToken(tokenData);
```

If you already know the ID of the user you're adding, you can save a few internal requests by doing:

```ts
authProvider.addUser('125328655', tokenData);
```

## Getting the initial token using an OAuth code

If you received an OAuth authorization code from Twitch's Authorization Code Flow,
you can use that to directly get a suitable {@link AccessToken} object using the `exchangeToken` function:

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
