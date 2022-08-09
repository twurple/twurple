module.exports = {
	preset: 'ts-jest',
	verbose: true,
	globals: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'ts-jest': {
			tsconfig: 'tsconfig.base.json'
		}
	}
};
