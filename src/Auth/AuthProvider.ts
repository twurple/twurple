interface AuthProvider {
	clientId: string;
	currentScopes: string[];

	getAuthToken(scopes?: string[]): Promise<string>;
}

export default AuthProvider;
