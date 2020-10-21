Welcome to the documentation of the API module of Twitch.js, a library for NodeJS and the browser that aims to provide an easy interface
to all of Twitch's programmatically available features.

Please feel free to browse the menu on the left to get started with the library and to check out all the different available classes.

## Authentication

This used to be the core package that provided both API and authentication functionality. In version 4.2, the package
`twitch-auth` was created that now does the job of centralizing authentication.

Thus, you should first check out [the `twitch-auth` documentation](/twitch-auth) in order to set up authentication.

## Additional packages

This package only provides API functionality. All the other things are located in other packages:

- [twitch-chat-client](/twitch-chat-client) - connect to and interact with Twitch Chat
- [twitch-pubsub-client](/twitch-pubsub-client) - listen to events using the Twitch PubSub interface
- [twitch-webhooks](/twitch-webhooks) - listen to events using WebHooks

## If you're getting stuck...

You can join the [Discord Server](https://discord.gg/b9ZqMfz) for support.
