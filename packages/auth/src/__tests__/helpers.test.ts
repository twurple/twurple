import { compareScopes, compareScopeSets } from '../helpers';

describe('compareScopes', () => {
	it('does nothing if there are no requested scopes', () => {
		compareScopes([]);
		compareScopes([], []);
		compareScopes(['channel:moderate']);
		compareScopes(['channel:moderate'], []);
	});

	it('passes if one of the requested scopes is present', () => {
		compareScopes(['bits:read'], ['bits:read']);
		compareScopes(['bits:read', 'channel:moderate'], ['bits:read']);
		compareScopes(['moderation:read'], ['moderation:read', 'channel:manage:moderators']);
		compareScopes(['channel:manage:moderators'], ['moderation:read', 'channel:manage:moderators']);
	});

	function expectError(scopesToCompare: string[], requestedScopes?: string[]) {
		expect(() => {
			compareScopes(scopesToCompare, requestedScopes);
		}).toThrow();
	}

	it('throws error if all requested scopes are not present', () => {
		expectError([], ['bits:read']);
		expectError(['channel:moderate'], ['bits:read']);
		expectError(['channel:moderate', 'channel:read:goals'], ['bits:read']);
		expectError(['channel:moderate'], ['moderation:read', 'channel:manage:moderators']);
	});

	it('passes for scope equivalencies', () => {
		compareScopes(['user:edit:broadcast'], ['channel:manage:broadcast']);
		compareScopes(['user:edit:broadcast'], ['channel:manage:extensions']);
		compareScopes(['channel_subscriptions'], ['channel:read:subscriptions']);
		compareScopes(['channel_subscriptions', 'channel:read:subscriptions'], ['channel:read:subscriptions']);
		compareScopes(
			['channel_subscriptions', 'channel:read:subscriptions'],
			['channel_subscriptions', 'channel:read:subscriptions'],
		);
		compareScopes(['channel_subscriptions', 'user_blocks_read'], ['channel:read:subscriptions']);
	});

	it('avoids undesired reverse scope equivalencies', () => {
		expectError(['channel:manage:broadcast'], ['user:edit:broadcast']);
		expectError(['channel:manage:extensions'], ['user:edit:broadcast']);
	});
});

describe('compareScopeSets', () => {
	it('does nothing if there are no requested scope sets', () => {
		compareScopeSets([], []);
		compareScopeSets(['bits:read'], []);
	});

	it('passes if one scope from each set is present', () => {
		compareScopeSets(['bits:read'], [['bits:read', 'moderation:read']]);
		compareScopeSets(
			['bits:read', 'moderation:read'],
			[['bits:read'], ['moderation:read', 'channel:manage:moderators']],
		);
		compareScopeSets(
			['bits:read', 'channel:manage:moderators'],
			[['bits:read'], ['moderation:read', 'channel:manage:moderators']],
		);
	});

	it('ignores empty scope sets', () => {
		compareScopeSets([], [[]]);
		compareScopeSets(['bits:read'], [[], ['bits:read'], []]);
	});

	function expectError(scopesToCompare: string[], requestedScopeSets: string[][]) {
		expect(() => {
			compareScopeSets(scopesToCompare, requestedScopeSets);
		}).toThrow();
	}

	it('throws error if there is not at least one scope per set present', () => {
		expectError([], [['bits:read']]);
		expectError(['channel:moderate'], [['bits:read']]);
		expectError(['channel:moderate', 'channel:read:goals'], [['bits:read']]);
		expectError(['channel:moderate'], [['channel:moderate'], ['moderation:read', 'channel:manage:moderators']]);
		expectError(['moderation:read'], [['channel:moderate'], ['moderation:read', 'channel:manage:moderators']]);
	});
});
