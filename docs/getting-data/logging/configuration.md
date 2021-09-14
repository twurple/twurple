There are multiple ways of configuring the log level of the logger included in the various Twurple packages. 
Which one you should use depends entirely on your desired level of configuration granularity.

## Configuration using environment variable

The logger used by Twurple supports configuration using an environment variable called `LOGGING`.

Loggers are separated into namespaces separated with colons.

Using these namespaces, you can set different log levels for different types of logs.

It's probably easiest to show this by example:

```
LOGGING="default=error;twurple=debug;twurple:api:rate-limiter=critical"
```

This tells the logger the following things:

- By default, only errors should be shown. (If you leave this out, the default is `warning`.)
- For Twurple packages, show detailed debug messages.
- For the API rate limiter, only show critical messages
(overrides the parent namespace setting and thus doesn't show debug messages).

## Configuration using the classes' constructors

All classes that log messages have support for a `logger` option in the constructor,
in which you can also set a minimum log level to display: 

```ts
const api = new ApiClient({
	// ...
	logger: {
		minLevel: 'debug'
	}
});
```

This setting always takes precedence over the environment variable settings.
