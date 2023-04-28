To use any part of the Twitch developer ecosystem, you first need to authenticate.

Twurple uses a concept named **Authentication Providers** to provide different kinds of tokens to the other parts of the application.

## Providers

You can choose between different ways to authenticate:

- To only ever use a single token determined at instantiation time, check out [Using a fixed token](/docs/auth/providers/static).  
  (This is mostly useful for quick prototyping and **not suitable for production apps**.)
- If you want to run something more long-term, you may be interested in [auto-refreshing tokens](/docs/auth/providers/refreshing).
- If you run an application that doesn't have any for of user login to access user-specific data, you can exclusively use [app tokens](/docs/auth/providers/app-tokens).
- If you are building a Twitch Extension frontend, there's an [Extension auth provider](/docs/auth/providers/extensions) too.
- If you have special requirements, you can write your own provider by implementing the {@link AuthProvider} interface.
