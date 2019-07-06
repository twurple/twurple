## Move all Kraken usage to `client.kraken`

`client.bits`, `client.channels`, `client.chat`, `client.search`, `client.streams` and `client.users` have all been removed.
Please use `client.kraken.*` instead. The names didn't change.

## Use `client.badges` instead of `client.chat` for the badges methods

The methods `client.kraken.chat.getGlobalBadges` and `client.kraken.chat.getChannelBadges` were misplaced in the {@ChatAPI} class.
They have been moved to their own namespace outside of the new Kraken namespace, `client.badges` ({@BadgesAPI}).

## Check the usage of paginated resources

A lot of methods like {@HelixGameAPI#getTopGames} and {@HelixClipAPI#getClipsForGame} have been changed
to return a {@HelixPaginatedRequest} instance in v1.
Now, they were changed back to return the respective data directly again.

If you still want to use the pagination helper, just append `Paginated` to the method name (e.g. `getTopGamesPaginated`).
If you don't need it, refactor your usage like so:

```
const { data: games } = await client.helix.games.getTopGames();
```
