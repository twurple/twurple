/** @private */
export function getMockApiPort(): string | null {
	try {
		return process.env.TWURPLE_MOCK_API_PORT ?? null;
	} catch {
		try {
			// @ts-ignore
			return import.meta.env.TWURPLE_MOCK_API_PORT ?? null; // eslint-disable-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
		} catch {
			return null;
		}
	}
}
