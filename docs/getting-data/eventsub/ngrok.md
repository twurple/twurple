`ngrok` is helpful for local testing when you don't want to expose your machine to traffic from outside directly.  
It also offers SSL, which is required by EventSub, thus making your development setup easier.

## 1. Installing ngrok and an adapter for it

Download and install ngrok from their [download page](https://ngrok.com/download).

Then, add the specialized apater for it to your packages:

    yarn add @twurple/eventsub-ngrok

or using npm:

    npm install @twurple/eventsub-ngrok

## 2. Setting up the listener

Listening to events using ngrok is easy since the ngrok adapter benefits from the ability to set itself up completely on its own:

```ts
// This is necessary to prevent conflict errors resulting from ngrok assigning a new host name every time
await apiClient.eventSub.deleteAllSubscriptions();

const listener = new EventSubListener({
	apiClient,
	adapter: new NgrokAdapter(),
	secret: 'thisShouldBeARandomlyGeneratedFixedString'
});
```

:::warning{title="Don't run ngrok on your own"}

The library will run ngrok for you, so you don't need to do that.

Running ngrok on your own will lead to conflicts and hard-to-understand errors.

:::

## 3. Listening to events

Now you can continue to follow the [basic listening help](/docs/getting-data/eventsub/listener-setup).
