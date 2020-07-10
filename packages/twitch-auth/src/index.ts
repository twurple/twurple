export { AccessToken } from './AccessToken';

export { exchangeCode, getAppToken, getTokenInfo, refreshUserToken, revokeToken } from './helpers';

export { TokenInfo, TokenInfoData } from './TokenInfo';

export { AuthProvider, AuthProviderTokenType } from './AuthProvider/AuthProvider';
export { ClientCredentialsAuthProvider } from './AuthProvider/ClientCredentialsAuthProvider';
export { RefreshableAuthProvider, RefreshConfig } from './AuthProvider/RefreshableAuthProvider';
export { StaticAuthProvider } from './AuthProvider/StaticAuthProvider';

export { InvalidTokenError } from './Errors/InvalidTokenError';

// twitch-auth@^1 compat
export { getAppAccessToken, getUserAccessToken, LegacyAuthCredentials, refreshUserAccessToken } from './legacy';
