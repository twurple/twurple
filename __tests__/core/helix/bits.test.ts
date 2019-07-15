describe('Helix Bits', () => {
	beforeAll(async () => {
		await setupMocks(jest);
	});

	test('Leaderboard', async () => {
		requireMockResponse(require.resolve('./mocks/bits-leaderboard'));
		const leaderboard = await twitch.helix.bits.getLeaderboard({ period: 'all' });
		expect(leaderboard.entries.length).toBeGreaterThan(0);
		expect(leaderboard.entries.map(entry => entry.rank)).toEqual([...Array(leaderboard.entries.length).keys()].map(i => i + 1));
	});
});
