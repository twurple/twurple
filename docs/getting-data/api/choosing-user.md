In general, Twurple automatically decides for you which user a call should be executed as.

There are mostly three categories of requests:

1. For calls that require authentication, the required user (or the app token) is always automatically chosen,
and if that user is not available in your auth provider, the call will fail.

2. Other calls, such as getting a stream by user ID, are in the context of a user, but do not require authentication.
In this case, Twurple will try using that user's authentication, but if it's not available,
fall back to app authentication.

3. Lastly, there are a few calls where user context can never be determined,
so they will **always be called using an app token**:

	| Category   | Method                                                               |
	|------------|----------------------------------------------------------------------|
	| Bits       | {@link HelixBitsApi#getCheermotes} (without `broadcaster` parameter) |
	| Channel    | {@link HelixChannelApi#getChannelInfoByIds}                          |
	| Chat       | {@link HelixChatApi#getGlobalBadges}                                 |
	| Chat       | {@link HelixChatApi#getGlobalEmotes}                                 |
	| Chat       | {@link HelixChatApi#getEmotesFromSets}                               |
	| Chat       | {@link HelixChatApi#getColorsForUsers}                               |
	| Clips      | {@link HelixClipApi#getClipsForGame}                                 |
	| Clips      | {@link HelixClipApi#getClipsByIds}                                   |
	| Clips      | {@link HelixClipApi#getClipById}                                     |
	| Extensions | {@link HelixExtensionsApi#getReleasedExtension}                      |
	| Games      | every method of {@link HelixGameApi}                                 |
	| Search     | every method of {@link HelixSearchApi}                               |
	| Streams    | {@link HelixStreamApi#getStreams}                                    |
	| Streams    | {@link HelixStreamApi#getStreamsByUserNames}                         |
	| Streams    | {@link HelixStreamApi#getStreamByUserName}                           |
	| Streams    | {@link HelixStreamApi#getStreamsByUserIds}                           |
	| Teams      | {@link HelixTeamApi#getTeamById}                                     |
	| Teams      | {@link HelixTeamApi#getTeamByName}                                   |
	| Users      | {@link HelixUserApi#getUsersByIds}                                   |
	| Users      | {@link HelixUserApi#getUsersByNames}                                 |
	| Users      | {@link HelixUserApi#getUserByName}                                   |
	| Videos     | {@link HelixVideoApi#getVideosByIds}                                 |
	| Videos     | {@link HelixVideoApi#getVideoById}                                   |
	| Videos     | {@link HelixVideoApi#getVideosByGame}                                |

	*Deprecated methods & paginated variants have been omitted for brevity.*

## Overriding optional user context

For the resources in categories 2 and 3, you can override the user context to a specified user ID
using the `asUser` method:

```ts
const videoId = await apiClient.asUser('125328655', ctx => {
	const video = ctx.videos.getVideoById(videoId);
	return video.id;
});
```

Alternatively, you can use [intents](/docs/auth/concepts/intents) using the {@link ApiClient#asIntent} method.
