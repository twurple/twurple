interface AuthProvider {
	clientId: string;
	currentScopes: string[];

	getAccessToken(scopes?: string[]): Promise<string>;
}

export default AuthProvider;
