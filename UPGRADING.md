# Upgrading from 1.x to 2.x

## Add initial scopes to your `withCredentials` call if necessary

The `StaticAuthProvider` that is created when you use `TwitchClient.withCredentials` now throws when any scopes are requested that are not initially passed to it. All scopes your token has need to be given in the new third parameter `initialScopes`. This also means that if you used a refresh config with this method, you need to add this parameter even if the token does not have any scopes.

## Change the return type of any implementations of `AuthProvider#getAccessToken`

This method should now return a full `AccessToken` object instead of the access token as a string.

## Remove the pagination parameter in `HelixClipAPI`

The second parameter named `pagination` in the methods `.getClipsForBroadcaster` and `.getClipsForGame` was a relic from 0.x days. They did not work at all. If you still used it, you need to remove it - it got replaced by a new parameter that enables you to filter the clips by creation date.

## Check your usage of `StatusCodeError` and other request errors

Whenever a request returned an error that was not caught by the library, a `StatusCodeError` (from the `request` library) was thrown. Since `request` has been replaced by `fetch-ponyfill`, which does not throw an error on 4xx and 5xx HTTP status codes by itself, we now expose a `HTTPStatusCodeError` type that you can catch instead. The status code is stored in the `.statusCode` property. For the same reason, `RequestError` is not a thing anymore. Instead, `node-fetch` exposes its own `FetchError`, and browsers differ widely. Because of this, you should not rely on the types of these errors.

## Remove promise usage from some Helix game and video API methods

The methods `HelixGameApi#getTopGames`, `HelixVideoApi#getVideosByUser` and `HelixVideoApi#getVideosByGame` were unnecessarily flagged `async` and thus returned `Promise`s. This mistake was rectified in 2.x, so you need to clean up any excess `.then` or `await` usage for these methods.
