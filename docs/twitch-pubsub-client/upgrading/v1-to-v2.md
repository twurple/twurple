## Rename `PubSubClient` to {@BasicPubSubClient}

If you used the basic `PubSubClient` class before, it was renamed to {@BasicPubSubClient}.

A new {@PubSubClient} class was introduced that has a much smoother developer experience. It's the default export.

## Pass an object instead of an argument list to the {@SingleUserPubSubClient} constructor

The constructor of {@SingleUserPubSubClient} was changed to take only a {@SingleUserPubSubClientOptions} object.

Anyway, the new {@PubSubClient} has an interface that's very similar to this class, but supports multiple users.
Consider using it instead of using {@SingleUserPubSubClient} directly.

## Remove any calls to {@SingleUserPubSubClient}'s `onCommerce` method

The `commerce` topic was abandoned by Twitch, so it was removed from the library as well.
