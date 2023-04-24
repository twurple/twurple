const useTypeInfo = !process.env.DF_ESLINT_NO_TYPE_INFO;

module.exports = {
	extends: ['@d-fischer'],
	parserOptions: {
		project: useTypeInfo ? 'tsconfig.base.json' : undefined
	},
	overrides: [
		{
			files: '**/*.external.ts',
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/naming-convention': 'off'
			}
		},
		{
			files: ['packages/chat/src/caps/*/messageTypes/*.ts', 'packages/chat/src/commands/*.ts'],
			rules: {
				'@typescript-eslint/no-empty-interface': 'off'
			}
		}
	]
};
