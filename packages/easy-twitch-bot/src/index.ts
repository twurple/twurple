/* eslint-disable filenames/match-exported */

import { deprecateClass } from '@d-fischer/shared-utils';

import { Bot } from './Bot';
/** @deprecated Use the named export `Bot` instead. */
const DeprecatedBot = deprecateClass(
	Bot,
	`[easy-twitch-bot] The default export has been deprecated. Use the named export instead:

\timport { Bot } from 'easy-twitch-bot';`
);
/** @deprecated Use the named export `Bot` instead. */
type DeprecatedBot = Bot;
/** @deprecated Use the named export `Bot` instead. */
export default DeprecatedBot;
export { Bot };

export { BotConfig } from './Bot';
export { BotCommand, BotCommandMatch } from './BotCommand';
export { BotCommandContext } from './BotCommandContext';
export { createBotCommand } from './helper';
