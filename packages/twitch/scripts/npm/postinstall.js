#!/usr/bin/env node

/* eslint-disable no-console,@typescript-eslint/no-require-imports */

const { getTopPackageDependencies } = require('top-package');

const argvJson = process.env.npm_config_argv;
if (!argvJson) {
	// bail on CI with npm >= 6.7 and other weirdnesses
	process.exit(0);
}
const argv = JSON.parse(argvJson);
if (!argv || !argv.remain || !argv.remain.length) {
	// only show recommendation when first adding to project, not when rebuilding from scratch (e.g. on a CI)
	process.exit(0);
}

const dependencies = getTopPackageDependencies();
if (!dependencies || (!dependencies['twitch-chat-client'] && !dependencies['twitch-pubsub-client'])) {
	console.log('\x1b[4m\x1b[96mtwitch - recommended packages\x1b[0m');
	console.log('For additional functionality, you may want to install one or more of the following packages:');
	console.log('\x1b[93mtwitch-chat-client\x1b[0m - chat functionality');
	console.log('\x1b[93mtwitch-pubsub-client\x1b[0m - PubSub events');
	console.log('\x1b[93mtwitch-webhooks\x1b[0m - WebHook events');
}
