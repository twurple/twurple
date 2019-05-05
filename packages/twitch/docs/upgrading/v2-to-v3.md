## \[Deprecation\] Move all Kraken usage to `client.kraken`

`client.bits`, `client.channels`, `client.chat`, `client.search`, `client.streams` and `client.users` have all been removed.
Please use `client.kraken.*` instead. The names didn't change.

## \[Deprecation\] Use `client.badges` instead of `client.chat` for the badges methods

The methods `client.kraken.chat.getGlobalBadges` and `client.kraken.chat.getChannelBadges` were misplaced in the {@ChatAPI} class.
They have been moved to their own namespace outside of the new Kraken namespace, `client.badges` ({@BadgesAPI}).
