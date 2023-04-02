## I'm trying to make my bot say something / join channels right after connecting, but doing it after calling `connect()` doesn't work.

Twitch uses the IRC protocol as foundation for its chat. In this protocol, after connection,
you must tell the server your name and (optionally) authenticate before you can send messages to channels.

The `connect()` method will finish before that authentication step,
which in turn means that you can't join channels or send messages yet.

Instead, you should use the `onAuthenticationSuccess` event to send messages.

```ts
chatClient.onAuthenticationSuccess(() => {
	chatClient.say('someone', 'Hello, I\'m now connected!');
})
```

For joining channels, the `channels` option exists in the constructor of the `ChatClient` class.
You can even pass an async function to it to dynamically access a possibly changing set of channels:

```ts
const chatClient = new ChatClient({
	authProvider,
	channels: async () => await someDatabase.select('twitchUsername').from('users').fetchAll().map(u => u.twitchUsername)
})
```

## Why does `EventSubMiddleware` show the error "The request body was already consumed by something else", and how do I fix it?

This happens because you're using conflicting middleware that parses the body, such as:

- `body-parser`
- `express.json()`
- `express.raw()`

Many popular express tutorials (in fact, even the official documentation of `express`!)
tell you to apply these body parsers for all requests, like so:

```js
const express = require('express');

const app = express();
app.use(express.json()); // don't do this!

app.get('/', (req, res) => res.send('Hello World'));
app.post('/echo-prop', (req, res) => res.send(req.body.prop));

app.listen(3000);
```

This code applies the JSON parser middleware for all requests.
That means that you have a JSON-parsed object in `req.body` at all times.  
Sadly, it also means that we can't read the raw body from the request anymore,
since it is already consumed by that middleware.

You might ask: "Why can't you just use `req.body` if it already exists in a parsed form?"  
The answer to this is that we need access to the raw body in order to match its signature.  
In order to verify that the request really came from Twitch,
they sign the request using the secret that was passed at subscription time.  
If we re-encode the JSON payload in `req.body` rather than using the raw data,
the result might be slightly mismatched in formatting, which breaks the signature.

The proper way to use body parser middleware is to apply them where you actually expect JSON *input*
(as opposed to returning JSON):

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Hello World'));
app.post('/echo-prop', express.json(), (req, res) => res.send(req.body.prop));

app.listen(3000);
```

## My `EventSubHttpListener` or `EventSubMiddleware` starts up correctly, but it never tells me about successful subscriptions, why?

This can have different reasons:

- If you run a reverse proxy in front of the listener, make sure it forwards the requests properly.
  The listener expects the `pathPrefix` to be stripped from the received URL.
  Consult your reverse proxy's logs
  and [set up logging for the listener](/docs/getting-data/logging/configuration) as well.
- Make sure your SSL is set up properly.
  In particular, you need to make sure you're using a trusted certificate (self-signed won't work)
  and that you're passing the full certificate chain.
  A good way to test your SSL setup is [the Qualys SSL Labs test](https://www.ssllabs.com/ssltest).
  It will make sure you find all trust and chain issues.
- Middleman services like CloudFlare are known to cause issues with inbound traffic from Twitch.
  Disable any of these and try again.

## EventSub: What does the error message `subscription missing proper authorization` mean?

If you're using `@twurple/eventsub-ws`, your user token just doesn't have the
[necessary scopes](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types) for the subscription.

`@twurple/eventsub-http` on the other hand uses app tokens to create subscriptions. App tokens can't have any scopes.  
However, that doesn't mean that authorization isn't necessary at all.
Twitch will check with its internal systems whether the user ever authorized the necessary scope for the topic
and give you the mentioned error message when it fails to find this authorization.

To get this authorization, simply [go through OAuth](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/)
(except the Client Credentials flow) with your client ID and the
[necessary scopes](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types) that are documented
for your desired subscription topics. You can throw away the token you get from this.
The authorization will still get saved on Twitch - now you can subscribe to your topics.
