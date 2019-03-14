# Contributing

## Reporting issues

Just create an issue in the [issue tracker](https://github.com/d-fischer/twitch/issues) for both bugs and feature requests.

When creating an issue, you can choose between a bug and a feature request.

**Do not ask for support or ask usage questions in the issue tracker.**
The issue will be closed without any comment since the issue tracker is not a support system.
There is a [Discord server](https://discord.gg/b9ZqMfz) where you can ask questions.

## Development

**READ THIS FIRST:** If you want to create a new feature, please file a feature request first. State that you want to implement the feature by yourself, too.
We will decide whether we want this feature in the library. You don't want to spend your precious time for nothing, do you?

### General code conventions

- Property names are always nouns.
- Function and method names always start with verbs.
- Acronyms shouldn't be camel cased - if they're at the beginning of a function or method name, they should be all lower case, otherwise they should be all upper case.
- All other code conventions are enforced by [TSLint](https://github.com/palantir/tslint), you'll notice when you're doing it wrong,
  especially when using an IDE or text editor with TSLint support. ;)
  Use your best judgement when you think you're writing something that needs an exception to the rules, especially the `no-any` rule. Annotate that exception so the lint step doesn't fail.

### Getting started

To get started, simply fork the repository, then clone the fork locally:

	git clone https://github.com/your-username/twitch.git

Then install the dependencies. We use yarn as our package manager, so to make sure you get the exact package versions of the lock file, you should use it too:

	yarn

After fixing the bug you wanted to fix, or implementing a new feature, you have to both lint and build the package:

	yarn run lint && yarn run build

### Documentation & Examples

Documentation contributions are always welcome.

The documentation is automatically built with [documen.ts](https://github.com/d-fischer/documen.ts) from the packages' `docs/` folders.
If you want to create a new documentation page, please reflect the outline structure in the file structure and remember to add it to `docs/config.json` as well.

### Sending a Pull Request

After writing your bug fix, feature or documentation improvement, send a pull request stating what it includes
and [which issue it fixes](https://help.github.com/articles/closing-issues-using-keywords/).
We will then review the code changes and either merge it or request further changes.
