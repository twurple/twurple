Any API surfaces that have some amount of user context (for example, API calls that relate directly to a user)
will automatically determine the user context they run their calls with.

For example, when fetching public info about a user, a token for that user will be requested from your provider,
which might return an app token if a fitting user token is not available.
For private info and mutations a user token will be required.

:::warning

At the moment, only the {@link RefreshingAuthProvider} implements this concept.

You can also include it in your own {@link AuthProvider} implementation. 

:::

## Usage with the {@link ApiClient}

All API requests that don't require a scope are, as stated above,
called with a token from the user the request relates to if applicable and available, otherwise an app token is used.

You can override this behavior using the {@link ApiClient#asUser} method:

```ts
// ctx will have the same methods as a regular ApiClient, so you can use any of its methods
const badgeNames = await apiClient.asUser(userId, async ctx => {
    // would normally get called using an app access token, but is overridden to use the given user token
    const badges = await ctx.chat.getGlobalBadges();

	// return value is available as the return value of `asUser` (so this will carry over to `badgeNames`)
	return badges.map(badge => badge.id);
});
```
