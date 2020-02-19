## How do I keep my tokens refreshed all the time, even across app restarts?

Persist the access token together with the refresh token and expiry time somewhere, and load this when your app starts.

You can find a basic example showing how this works in the [twitch-chat-client documentation](/twitch-chat-client/docs/examples/basic-bot).

## TypeScript: How to fix "error TS2304: Cannot find name 'Response'"?

We're actively looking for a way to fix this.

In the meantime, a workaround for this is to include the `dom` library in your `lib` compiler option/tsconfig section (even if you're running in node). The polyfill we use depends on the `Response` type from that standard library.

## TypeScript: How to fix "error TS2339: Property 'asyncIterator' does not exist on type 'SymbolConstructor'"?

Please add `esnext.asynciterable` to your `lib` compiler option/tsconfig section. Don't worry about browser or node compatibility - this is only used in the actual code when your environment supports it.

## I have more questions! Where do I get help?

You can join the [Discord Server](https://discord.gg/b9ZqMfz) for support.
