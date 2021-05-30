# ⚠ WARNING

This is a future version still in development. For a stable version, check out [the `versions/4.5` branch](https://github.com/twurple/twurple/tree/versions/4.5).

# Twurple
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-25-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

A set of libraries that aims to cover all of the existing Twitch APIs.

- Query the Kraken v5 & Helix APIs
- Build a chat bot
- React to custom redemptions, subscriptions, follows and much more using PubSub and WebHooks
- Do all this without caring about the expiry of your access tokens - **we can refresh them automatically**

## Installation

To add Twurple to your project, just execute:

	yarn add @twurple/auth

or using npm:

	npm install @twurple/auth

## Documentation

A good place to start with this library is the [documentation](https://twurple.github.io)
which also includes a complete reference of all classes and interfaces, as well as changes and deprecations between major versions.

## Additional packages

The mentioned `@twurple/auth` package only provides authentication functionality. All the other things are located in separate packages:

- [@twurple/api](https://npmjs.com/package/@twurple/api) - make calls to the Kraken and Helix APIs
- [@twurple/chat](https://npmjs.com/package/@twurple/chat) - connect to and interact with Twitch Chat
- [@twurple/pubsub](https://npmjs.com/package/@twurple/pubsub) - listen to events using the Twitch PubSub interface
- [@twurple/webhooks](https://npmjs.com/package/@twurple/webhooks) - listen to events using WebHooks
- [@twurple/eventsub](https://npmjs.com/package/@twurple/eventsub) - listen to events using EventSub

## If you're getting stuck...

You can join the [Discord server](https://discord.gg/b9ZqMfz) for support.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/d-fischer"><img src="https://avatars3.githubusercontent.com/u/5854687?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Fischer</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=d-fischer" title="Code">💻</a> <a href="https://github.com/twurple/twurple/commits?author=d-fischer" title="Documentation">📖</a> <a href="#example-d-fischer" title="Examples">💡</a> <a href="#infra-d-fischer" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-d-fischer" title="Maintenance">🚧</a> <a href="https://github.com/twurple/twurple/pulls?q=is%3Apr+reviewed-by%3Ad-fischer" title="Reviewed Pull Requests">👀</a> <a href="#tool-d-fischer" title="Tools">🔧</a></td>
    <td align="center"><a href="https://humanoids.be"><img src="https://avatars0.githubusercontent.com/u/640949?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin Giger</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=freaktechnik" title="Code">💻</a> <a href="#question-freaktechnik" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/JakubKohout"><img src="https://avatars0.githubusercontent.com/u/339965?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jakub Kohout</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=JakubKohout" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lafiosca"><img src="https://avatars2.githubusercontent.com/u/9442662?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe Lafiosca</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=lafiosca" title="Code">💻</a></td>
    <td align="center"><a href="https://gu3.st"><img src="https://avatars2.githubusercontent.com/u/375232?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dustin Dawes</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=gu3st" title="Code">💻</a></td>
    <td align="center"><a href="http://abb.ink"><img src="https://avatars3.githubusercontent.com/u/2461972?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jasper Abbink</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=jabbink" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lclc98"><img src="https://avatars2.githubusercontent.com/u/1905336?v=4?s=100" width="100px;" alt=""/><br /><sub><b>lclc98</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=lclc98" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://dfdx.us"><img src="https://avatars0.githubusercontent.com/u/3087358?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Haley Hitch</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=dfoverdx" title="Code">💻</a></td>
    <td align="center"><a href="https://streamcord.io/"><img src="https://avatars3.githubusercontent.com/u/19719195?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akira</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=devakira" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/Robinlemonz"><img src="https://avatars2.githubusercontent.com/u/12851394?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lewis Gibson</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=Robinlemon" title="Code">💻</a></td>
    <td align="center"><a href="http://ashuvidz.com"><img src="https://avatars3.githubusercontent.com/u/4967868?v=4?s=100" width="100px;" alt=""/><br /><sub><b>VyrtualSynthese</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=vyrtualsynthese" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Spidy88"><img src="https://avatars1.githubusercontent.com/u/1076168?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick Ferraro</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=Spidy88" title="Code">💻</a></td>
    <td align="center"><a href="https://alca.tv"><img src="https://avatars2.githubusercontent.com/u/7132646?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jacob Foster</b></sub></a><br /><a href="#question-AlcaDesign" title="Answering Questions">💬</a> <a href="https://github.com/twurple/twurple/commits?author=AlcaDesign" title="Code">💻</a></td>
    <td align="center"><a href="http://blerp.com"><img src="https://avatars2.githubusercontent.com/u/10217999?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aaron Kc Hsu</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=aaronkchsu" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/talk2MeGooseman"><img src="https://avatars3.githubusercontent.com/u/1203718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Erik Guzman</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=talk2MeGooseman" title="Code">💻</a></td>
    <td align="center"><a href="http://trezy.com"><img src="https://avatars2.githubusercontent.com/u/442980?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Trezy</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=trezy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/travtarr"><img src="https://avatars3.githubusercontent.com/u/7989582?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Travis Tarr</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=travtarr" title="Code">💻</a></td>
    <td align="center"><a href="http://multitwitch.co"><img src="https://avatars3.githubusercontent.com/u/11161511?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Grégoire Joncour</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=gregoire78" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/maciej-trebacz"><img src="https://avatars3.githubusercontent.com/u/1614514?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Trębacz</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=maciej-trebacz" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Technikkeller"><img src="https://avatars1.githubusercontent.com/u/29926093?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Justus Fluegel</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=Technikkeller" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/daniel0611"><img src="https://avatars0.githubusercontent.com/u/30466471?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Huber</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=daniel0611" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://adamcrowder.net"><img src="https://avatars1.githubusercontent.com/u/11189778?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=cheeseandcereal" title="Code">💻</a></td>
    <td align="center"><a href="https://crutchcorn.dev"><img src="https://avatars0.githubusercontent.com/u/9100169?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Corbin Crutchley</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=crutchcorn" title="Code">💻</a></td>
    <td align="center"><a href="https://hirst.xyz"><img src="https://avatars3.githubusercontent.com/u/45145746?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sam Hirst</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=Naeviant" title="Code">💻</a></td>
    <td align="center"><a href="https://gitlab.com/cactys"><img src="https://avatars.githubusercontent.com/u/5056880?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cλctysman</b></sub></a><br /><a href="https://github.com/twurple/twurple/commits?author=cactysman" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
