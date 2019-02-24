# Upgrading from 1.x to 2.x

## Handle `TwitchClient.withCredentials` now returning a Promise and having an additional argument

The `StaticAuthProvider` that is created when you use `TwitchClient.withCredentials` now throws when any scopes are requested that are not initially passed to it. Because of that, a new parameter was added to `TwitchClient.withCredentials` that determines the initial scopes. If this parameter is not given, the scopes are automatically determined using a call to the Twitch API. Since this parameter was added before the `refreshConfig` parameter, it needs to be added when you need auto-refreshing (set it to `undefined` if you don't need it).

## Change the return type of any implementations of `AuthProvider#getAccessToken`

This method should now return a full `AccessToken` object instead of the access token as a string.

## Replace the usage of the method `UserAPI.getUserEmotes` without an argument

`client.users.getUserEmotes()` was essentially a shorthand for `client.users.getUserEmotes(await client.users.getMe())`, but with added technical complexity. Instead of this, you can now use the method `User#getEmotes`, or just get your user ID from somewhere and use the method with the user parameter.

The `AuthorizationError` used only for this purpose was removed too.

## Remove the pagination parameter in usages of `HelixClipAPI`

The second parameter named `pagination` in the methods `.getClipsForBroadcaster` and `.getClipsForGame` was a relic from 0.x days. They did not work at all. If you still used it, you need to remove it - it got replaced by a new parameter that enables you to filter the clips by creation date.

## Check your usage of `StatusCodeError` and other request errors

Whenever a request returned an error that was not caught by the library, a `StatusCodeError` (from the `request` library) was thrown. Since `request` has been replaced by `fetch-ponyfill`, which does not throw an error on 4xx and 5xx HTTP status codes by itself, we now expose a `HTTPStatusCodeError` type that you can catch instead. The status code is stored in the `.statusCode` property. For the same reason, `RequestError` is not a thing anymore. Instead, `node-fetch` exposes its own `FetchError`, and browsers differ widely. Because of this, you should not rely on the types of these errors.

## Remove promise usage from some Helix game and video API methods

The methods `HelixGameApi#getTopGames`, `HelixVideoApi#getVideosByUser` and `HelixVideoApi#getVideosByGame` were unnecessarily flagged `async` and thus returned `Promise`s. This mistake was rectified in 2.x, so you need to clean up any excess `.then` or `await` usage for these methods.

## \[Deprecation\] Move all Kraken usage to `client.kraken`

`client.bits`, `client.channels`, `client.chat`, `client.search`, `client.streams` and `client.users` have all been deprecated and scheduled for removal in version 3.0. Please use `client.kraken.*` instead. The names didn't change.

## \[Deprecation\] Use `client.badges` instead of `client.chat` for the badges methods

The methods `client.chat.getGlobalBadges` and `client.chat.getChannelBadges` were misplaced in the `ChatAPI` class. They have been moved to their own namespace outside of the new Kraken namespace, `client.badges`. Both `client.chat.get*Badges` and `client.kraken.chat.get*Badges` will still work, but have been scheduled for removal in 3.0.
