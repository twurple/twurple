It is possible to facilitate your own logger (like sending it to a central logging facility such as DataDog)
by adding a small wrapper around it and passing it to the `custom` property of the `logger` option.

:::warning{title="Log levels"}

Please note that even if you use these custom loggers, the minimum log levels from the `LOGGING` environment variable
and the `minLevel` property are still applied, although,
as opposed to the default logger, the default level of `warning` does *not* apply here.

:::

## Simple - function form

```ts
const chat = new ChatClient({
	// ...
	logger: {
		custom: (level, message) => {
			// ... send to whatever ...
		}
	}
})
```

The `level` parameter is a member of the [`LogLevel` enum](https://github.com/d-fischer/logger/blob/b021ee7ed84499a4d090c351487bda16c1dd617e/src/LogLevel.ts#L3-L10)
which you should import from the [`@d-fischer/logger` package](https://www.npmjs.com/package/@d-fischer/logger)
to transform it back into a string rather than reversing the level manually with a `switch` or multiple `if` statements.

## Advanced - object form

```ts
const chat = new ChatClient({
	// ...
	logger: {
		custom: {
			log: (level, message) => {
				// ... send to whatever ...
			},
			error: message => {
				// ... send to something else ...
			},
			// ... more level specific handling ...
		}
	}
})
```

In the object form, you have to supply a generic function named `log` which is similar to the function form above.

But additionally, you can implement different functions that act differently for specific log levels. 
The log messages covered by these methods will *not* go through the `log` function.

The names of the overridable level logger methods are: `crit`, `error`, `warn`, `info`, `debug`, `trace`. 
Please note that you don't have to override *all* of them -
log messages without a specific override will go to the `log` function instead.
