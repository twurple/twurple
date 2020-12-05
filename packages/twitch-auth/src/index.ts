export { AccessToken } from './AccessToken';
export type { AccessTokenData } from './AccessToken';

export {
	exchangeCode,
	getAppToken,
	getTokenInfo,
	getValidTokenFromProvider,
	refreshUserToken,
	revokeToken
} from './helpers';

export { TokenInfo } from './TokenInfo';
export type { TokenInfoData } from './TokenInfo';

export type { AuthProvider, AuthProviderTokenType } from './AuthProvider/AuthProvider';
export { ClientCredentialsAuthProvider } from './AuthProvider/ClientCredentialsAuthProvider';
export { RefreshableAuthProvider } from './AuthProvider/RefreshableAuthProvider';
export type { RefreshConfig } from './AuthProvider/RefreshableAuthProvider';
export { StaticAuthProvider } from './AuthProvider/StaticAuthProvider';

export { InvalidTokenError } from './Errors/InvalidTokenError';

// twitch-auth@^1 compat
export { getAppAccessToken, getUserAccessToken, refreshUserAccessToken } from './legacy';
export type { LegacyAuthCredentials } from './legacy';
