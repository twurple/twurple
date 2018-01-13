interface AuthProvider {
	clientId: string;
	currentScopes: string[];

	// IMPLEMENTING NOTE: don't do anything major in getAccessToken when not supplying any scopes (i.e. just return the cached token)
	// unless you're implementing a decorator and/or know what you're doing
	getAccessToken(scopes?: string[]): Promise<string>;
	setAccessToken(token: string): void;
}

export default AuthProvider;
