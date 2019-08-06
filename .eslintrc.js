const path = require('path');

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	plugins: [
		'@typescript-eslint',
		'filenames',
		'fp',
		'import',
		'jsdoc'
	],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': ['error', 'array-simple'],
		'@typescript-eslint/class-name-casing': 'error',
		'@typescript-eslint/explicit-member-accessibility': ['error', {
			accessibility: 'no-public',
			overrides: {
				parameterProperties: 'explicit'
			}
		}],
		'@typescript-eslint/interface-name-prefix': ['error', 'never'],
		'@typescript-eslint/member-ordering': [
			'error',
			{
				default: [
					'static-field',
					'field',
					'public-static-method',
					'constructor',
					'method',
					'protected-method',
					'private-method'
				]
			}
		],
		'@typescript-eslint/no-angle-bracket-type-assertion': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-extraneous-class': 'error',
		'@typescript-eslint/no-for-in-array': 'error',
		'@typescript-eslint/no-inferrable-types': [
			'error',
			{
				ignoreProperties: true,
				ignoreParameters: true
			}
		],
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-object-literal-type-assertion': 'error',
		'@typescript-eslint/no-triple-slash-reference': 'error',
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/no-this-alias': [
			'error',
			{
				allowDestructuring: true
			}
		],
		'@typescript-eslint/no-unnecessary-qualifier': 'error',
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-interface': 'error',
		'@typescript-eslint/promise-function-async': [
			'error',
			{
				'allowAny': true
			}
		],
		'@typescript-eslint/restrict-plus-operands': 'error',
		// in master, but not released yet!
		// '@typescript-eslint/typedef': 'error',
		'@typescript-eslint/unbound-method': 'error',
		'arrow-body-style': ['error', 'as-needed'],
		'camelcase': 'off',
		'@typescript-eslint/camelcase': ['error', {
			// only allow stuff Twitch uses
			'allow': [
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
		}],
		'consistent-return': 'error',
		'default-case': 'error',
		// not a thing right now
		// 'deprecation': 'error',
		'eqeqeq': [
			'error',
			'always',
			{
				null: 'ignore'
			}
		],
		'eol-last': ['error', 'always'],
		'filenames/match-exported': 'error',
		'fp/no-delete': 'error',
		'guard-for-in': 'error',
		'import/no-unassigned-import': 'error',
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		// errors with ts
		// 'jsdoc/check-param-names': 'error',
		// 'jsdoc/require-param': 'error',
		'jsdoc/check-tag-names': 'error',
		'jsdoc/newline-after-description': ['error', 'always'],
		'max-classes-per-file': ['error', 1],
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-console': 'error',
		'no-debugger': 'error',
		'no-duplicate-case': 'error',
		'no-duplicate-imports': 'error',
		'no-empty': 'error',
		'no-empty-character-class': 'error',
		'no-eval': 'error',
		'no-extra-semi': 'error',
		'no-ex-assign': 'error',
		'no-fallthrough': [
			'error', {
				commentPattern: 'fallthrough'
			}
		],
		'no-irregular-whitespace': 'error',
		'no-labels': 'error',
		'no-negated-condition': 'error',
		'no-new': 'error',
		'no-new-wrappers': 'error',
		'no-prototype-builtins': 'error',
		'no-redeclare': 'error',
		'no-restricted-syntax': [
			'error',
			{
				selector: 'BinaryExpression[operator=/^[!=]==?$/][left.raw=/^(true|false)$/], BinaryExpression[operator=/^[!=]==?$/][right.raw=/^(true|false)$/]',
				message: 'Don\'t compare for equality against boolean literals'
			},
			{
				selector: 'SequenceExpression',
				message: 'The comma operator is confusing and a common mistake. Don’t use it!'
			}
		],
		'no-return-await': 'error',
		'no-shadow': 'error',
		'no-sparse-arrays': 'error',
		'no-throw-literal': 'error',
		'no-unexpected-multiline': 'error',
		'no-unneeded-ternary': 'error',
		'no-unsafe-finally': 'error',
		'no-use-before-define': 'error',
		'no-var': 'error',
		'prefer-arrow-callback': [
			'error',
			{
				allowUnboundThis: false
			}
		],
		'prefer-const': [
			'error',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: true
			}
		],
		'prefer-object-spread': 'error',
		'prefer-rest-params': 'error',
		'prefer-template': 'error',
		'radix': [
			'error',
			'always'
		],
		'spaced-comment': [
			'error',
			'always',
			{
				exceptions: ['*']
			}
		],
		'use-isnan': 'error',
		'yoda': ['error', 'never']
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-lerna': {
				packages: path.resolve(__dirname, 'packages')
			}
		},
		'jsdoc': {
			additionalTagNames: {
				customTags: ['inheritDoc', 'expandParams']
			}
		}
	}
};
