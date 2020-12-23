`ngrok` is helpful for local testing when you don't want to expose your machine to traffic from outside directly. It also offers SSL, which is required for testing authenticated WebHook endpoints.

## 1. Installing ngrok and an adapter for it

Download and install ngrok from their [download page](https://ngrok.com/download).

Then, add the specialized apater for it to your packages:

	yarn add twitch-webhooks-ngrok

or using npm:

	npm install --save twitch-webhooks-ngrok

## 2. Setting up the listener

Listening to events using ngrok is easy since the ngrok adapter benefits from the ability to set itself up completely on its own:

```typescript
const listener = new WebHookListener(client, new NgrokAdapter(), { hookValidity: 60 });
```


## 3. Listening to events

Now you can continue to follow the [basic listening help](/twitch-webhooks/docs/basic-usage/listening-to-events).
