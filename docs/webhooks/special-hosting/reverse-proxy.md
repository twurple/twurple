For bigger projects, you often find yourself in need for a reverse proxy that sits in front of your internal network and distributes requests. Fortunately, this is no challenge for this library.

There are multiple options available to configure your listener.

## Configuration using an environment variable

Some hosting providers (e.g. Heroku) offer an environment variable (usually named `PORT`) you have to listen on.

```typescript
const listener = new WebHookListener(client, new EnvPortAdapter({ hostName: 'example.herokuapp.com' }));
```

## Manual configuration

If you don't use an environment variable, you need to set up the listener port manually. Be sure to have it match your reverse proxy's configuration.

```typescript
const listener = new WebHookListener(client, new ReverseProxyAdapter({
    hostName: 'example.com', // The host name the server is available from
    listenerPort: 8090 // The internal listener port
}));
```

By default, this assumes that the reverse proxy is running with SSL on the default port 443.

A full list of configuration options is available on the {@ReverseProxyAdapter} reference page.

## Listening to events

Now you can continue to follow the [basic listening help](/docs/webhooks/basic-usage/listening-to-events).
