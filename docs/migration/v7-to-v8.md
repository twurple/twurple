## Make sure your Node version is new enough

We don't test on Node versions below 20 anymore, so make sure you are running a supported Node version.

## Remove pubsub package

The `@twurple/pubsub` package was removed, as Twitch removed the underlying PubSub system.
It has been removed for a while now, so the package shouldn't work anymore regardless.

## Update all packages to the same version

Make sure that all Twurple packages are up-to-date and on the same version.

On a unix-like system with the `jq` utility installed, you can use one of these handy one-liners for that:

	# for npm
	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs printf '%s@latest\n' | xargs npm install --save
	# for yarn
	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs yarn add
	# for pnpm
	jq -r '.dependencies | keys[] | select(. | startswith("@twurple/"))' package.json | xargs pnpm add

## Check whether you may need to use the `--experimental-require-module` flag

On node 20 below 20.19, you may need to use the `--experimental-require-module` node CLI flag
if your application is written in CommonJS.
If you're unsure, check your `package.json` for a `"type": "module"` entry.
If it's not there, you're likely using CommonJS.

## Update to express 5

If you are using `@twurple/eventsub-http` with an Express-based server,
express 5 is now required for TypeScript type safety. Make sure to update your express version accordingly;
otherwise, you may run into type errors.

## Check usage of {@link EventSubChannelChatAnnouncementNotificationEvent#color}

The {@link EventSubChannelChatAnnouncementNotificationEvent#color} property was changed to contain the user color
rather than the announcement color. If you were using this property to set the announcement color,
you should now use the {@link EventSubChannelChatAnnouncementNotificationEvent#announcementColor} property instead.

## Check usage of {@link EventSubChannelSubscriptionGiftEvent} gifter properties

`null` was added to the types of the gifter-related properties of {@link EventSubChannelSubscriptionGiftEvent}
to reflect that anonymous gifting is possible. This applies to the following properties:

- {@link EventSubChannelSubscriptionGiftEvent#gifterId}
- {@link EventSubChannelSubscriptionGiftEvent#gifterName}
- {@link EventSubChannelSubscriptionGiftEvent#gifterDisplayName}

This only directly affects TypeScript users since it creates compile errors;
however, if you were relying on these properties always being defined,
you should add checks for `null` values, even if you are not using TypeScript.

## Replace `mockServerPort` from your {@link ApiClient} config with environment variable

The `mockServerPort` option from the {@link ApiClient} constructor config was removed.
If you were using it to test your application against a mock server,
you should now use the `TWURPLE_MOCK_API_PORT` environment variable instead.

## Check error handling for {@link HelixChatApi#sendChatMessage} and {@link HelixChatApi#sendChatMessageAsApp}

The methods {@link HelixChatApi#sendChatMessage} and {@link HelixChatApi#sendChatMessageAsApp}
now throw a {@link ChatMessageDroppedError} when the message is dropped by Twitch rather than returning an object with
`isSent: false`. If you were relying on that behavior, you should update your error handling accordingly.

## Update Hype Train API usage

The Hype Train API has been changed to use the new endpoints Twitch introduced.
If you were using any of the following methods,
you should switch to the new {@link HelixHypeTrainApi#geteHypeTrainStatusForBroadcaster} method:

- `HelixHypeTrainApi#getHypeTrainEventsForBroadcaster`
- `HelixHypeTrainApi#getHypeTrainEventsForBroadcasterPaginated`
