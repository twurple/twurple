`ngrok` is helpful for local testing when you don't want to expose your machine to traffic from outside directly. It also offers SSL, which is required for testing authenticated WebHook endpoints.

## 1. Installing ngrok

Download and install ngrok from their [download page](https://ngrok.com/download).

## 2. Running ngrok

Run the following command (if ngrok is not in the current directory, adjust its path accordingly):

```
./ngrok http 8090
```

If port 8090 is already used on your machine, change the port to anything else. ngrok will not complain, but the next step will.

If everything went well and you're *sure* that the port you used isn't already running something else, copy the URL that's shown (without `http://` or `https://`).

## 3. Setting up the listener

```typescript
const listener = await WebHookListener.create(client, {
    hostName: 'XXXX.ngrok.io',
    port: 8090,
    reverseProxy: { port: 443, ssl: true }
})
```

Please replace `XXXX.ngrok.io` with the host name you were given and `8090` with the port you used in step 2.

## 4. Listening to events

Now you can continue to follow the [basic listening help](/twitch-webhooks/docs/basic-usage/listening-to-events).
