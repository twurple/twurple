import { compareScopes } from '../helpers';

describe('Scope comparer', () => {
	it('does nothing when required scopes are absent', () => {
		compareScopes([]);
		compareScopes([], []);
		compareScopes(['channel:moderate']);
		compareScopes(['channel:moderate'], []);
	});

	it('passes when required scopes are met', () => {
		compareScopes(['bits:read'], ['bits:read']);
		compareScopes(['bits:read', 'channel:moderate'], ['bits:read']);
		compareScopes(['bits:read', 'channel:moderate'], ['bits:read', 'channel:moderate']);
		compareScopes(['bits:read', 'channel:moderate', 'channel:read:goals'], ['bits:read', 'channel:moderate']);
		compareScopes(
			['bits:read', 'channel:moderate', 'channel:read:goals'],
			['bits:read', 'channel:moderate', 'channel:read:goals']
		);
	});

	function expectError(scopesToCompare: string[], requestedScopes?: string[]) {
		expect(() => {
			compareScopes(scopesToCompare, requestedScopes);
		}).toThrow();
	}

	it('throws error when a require scope is not present', () => {
		expectError([], ['bits:read']);
		expectError(['channel:moderate'], ['bits:read']);
		expectError(['channel:moderate'], ['bits:read', 'channel:moderate']);
		expectError(['channel:moderate'], ['channel:moderate', 'bits:read']);
		expectError(['channel:moderate', 'channel:read:goals'], ['channel:moderate', 'bits:read']);
		expectError(
			['channel:moderate', 'channel:read:goals'],
			['channel:moderate', 'channel:read:goals', 'bits:read']
		);
	});

	it('passes for scope equivalencies', () => {
		compareScopes(['user:edit:broadcast'], ['channel:manage:broadcast']);
		compareScopes(['channel_subscriptions'], ['channel:read:subscriptions']);
		compareScopes(['channel_subscriptions', 'channel:read:subscriptions'], ['channel:read:subscriptions']);
		compareScopes(
			['channel_subscriptions', 'channel:read:subscriptions'],
			['channel_subscriptions', 'channel:read:subscriptions']
		);
		compareScopes(['channel_subscriptions', 'user_blocks_read'], ['channel:read:subscriptions']);
		compareScopes(
			['channel_subscriptions', 'user_blocks_read'],
			['channel:read:subscriptions', 'user:read:blocked_users']
		);
		compareScopes(
			['channel_subscriptions', 'user_blocks_read', 'channel:read:goals'],
			['channel:read:subscriptions', 'user:read:blocked_users']
		);
		compareScopes(
			['channel_subscriptions', 'user_blocks_read', 'channel:read:goals'],
			['channel:read:subscriptions', 'user:read:blocked_users', 'channel:read:goals']
		);
	});

	it('avoids undesired reverse scope equivalencies', () => {
		expectError(['channel:manage:broadcast'], ['user:edit:broadcast']);
	});
});
