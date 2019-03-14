## Make sure you can get a token with the correct chat scopes

A few months ago, Twitch added the new chat scopes `chat:read` and `chat:edit` which removed support of the `chat_login` scope for client IDs that were created after this change. The client now defaults to requesting `chat:read` and (if you don't set the other new option `readOnly`) `chat:edit`. If you need to use `chat_login` instead (because you use an old client ID), you need to set the option `legacyScopes`.

This option is now necessary because the core client was made stricter in terms of requesting scopes on a token that can't get any scope upgrades.

## Use the new method for parsing bits out of a message

The message objects returned by the events were completely decoupled from the chat client itself. Thus, if you used ${PrivateMessage#getSeparateBits} before, this method was removed as it relied on the client being available for fetching the possible cheermotes in the channel.

You now need to use the separately exported function `parseBits` instead.
