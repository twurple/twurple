const path = require('path');

module.exports = {
	extends: ['@d-fischer'],
	rules: {
		'@typescript-eslint/camelcase': [
			'error',
			{
				// only allow stuff Twitch uses
				allow: [
					'_(id|name)$',
					'user_login',
					'client_secret',
					'redirect_uri',
					'(created|updated|started|ended)_at',
					'(access|refresh|auth)_token',
					'has_delay',
					'include_sponsored',
					'x1_5',
					'stream_(key|type)',
					'broadcaster_language',
					'grant_type'
				]
			}
		]
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-lerna': {
				packages: path.resolve(__dirname, 'packages')
			}
		}
	}
};
