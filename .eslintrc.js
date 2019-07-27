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
		'jsdoc',
		'node'
	],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': ['error', 'array-simple'],
		'@typescript-eslint/class-name-casing': 'error',
		// currently not the same kind of options as tslint member-access
		// track https://github.com/typescript-eslint/typescript-eslint/pull/322
		// '@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/interface-name-prefix': ['error', 'never'],
		'@typescript-eslint/member-delimiter-style': 'error',
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
		// seems to find lots of false positives...
		// '@typescript-eslint/promise-function-async': 'error',
		'@typescript-eslint/restrict-plus-operands': 'error',
		// does not exist (yet?)
		// '@typescript-eslint/typedef': 'error',
		'@typescript-eslint/type-annotation-spacing': 'error',
		// in master, but not released yet!
		// '@typescript-eslint/unbound-method': 'error',
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'as-needed'],
		'brace-style': [
			'error',
			'1tbs',
			{
				allowSingleLine: true
			}
		],
		'comma-dangle': ['error', 'never'],
		'consistent-return': 'error',
		'curly': 'error',
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
		'indent': [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 'first',
				FunctionDeclaration: {
					parameters: 'first'
				},
				FunctionExpression: {
					parameters: 'first'
				},
				CallExpression: {
					arguments: 'first'
				}
			}
		],
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		// errors with ts
		// 'jsdoc/check-param-names': 'error',
		// 'jsdoc/require-param': 'error',
		'jsdoc/check-tag-names': 'error',
		'jsdoc/newline-after-description': ['error', 'always'],
		'linebreak-style': ['error', 'unix'],
		'max-classes-per-file': ['error', 1],
		'max-len': ['error', 200],
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
		'no-multiple-empty-lines': 'error',
		'no-negated-condition': 'error',
		'no-new': 'error',
		'no-new-wrappers': 'error',
		'no-prototype-builtins': 'error',
		'no-redeclare': 'error',
		'no-restricted-syntax': [
			'error',
			{
				'selector': 'BinaryExpression[operator=/^[!=]==?$/][left.raw=/^(true|false)$/], BinaryExpression[operator=/^[!=]==?$/][right.raw=/^(true|false)$/]',
				'message': 'Don\'t compare for equality against boolean literals'
			}
		],
		'no-return-await': 'error',
		'no-sequences': 'error',
		'no-shadow': 'error',
		'no-sparse-arrays': 'error',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-unneeded-ternary': 'error',
		'no-unsafe-finally': 'error',
		'no-use-before-define': 'error',
		'no-var': 'error',
		'node/no-unpublished-import': 'error',
		'object-curly-spacing': ['error', 'always'],
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
		'quotes': [
			'error',
			'single',
			{
				avoidEscape: true
			}
		],
		'quote-props': ['error', 'as-needed'],
		'radix': [
			'error',
			'always'
		],
		// breaks TS interfaces :(
		// 'semi': ['error', 'always'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			}
		],
		'space-in-parens': ['error', 'never'],
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
