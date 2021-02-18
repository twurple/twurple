`ngrok` is helpful for local testing when you don't want to expose your machine to traffic from outside directly.  
It also offers SSL, which is required by EventSub, thus making your development setup easier.

## 1. Installing ngrok and an adapter for it

Download and install ngrok from their [download page](https://ngrok.com/download).

Then, add the specialized apater for it to your packages:

    yarn add twitch-eventsub-ngrok

or using npm:

    npm install twitch-eventsub-ngrok

## 2. Setting up the listener

Listening to events using ngrok is easy since the ngrok adapter benefits from the ability to set itself up completely on its own:

```typescript
const listener = new EventSubListener(client, new NgrokAdapter(), 'thisShouldBeARandomlyGeneratedFixedString');
```

## 3. Listening to events

Now you can continue to follow the [basic listening help](/twitch-eventsub/docs/basic-usage/listening-to-events).
