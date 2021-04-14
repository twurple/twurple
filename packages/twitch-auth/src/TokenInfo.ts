/** @private */
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';

export interface TokenInfoData {
	client_id: string;
	login: string;
	scopes: string[];
	user_id: string;
	expires_in?: number;
}

/**
 * Information about an access token.
 */
@rtfm<TokenInfo>('twitch-auth', 'TokenInfo', 'clientId')
export class TokenInfo {
	private readonly _obtainmentDate: Date;
	@Enumerable(false) private readonly _data: TokenInfoData;

	/** @private */
	constructor(data: TokenInfoData) {
		this._data = data;
		this._obtainmentDate = new Date();
	}

	/**
	 * The client ID.
	 */
	get clientId(): string {
		return this._data.client_id;
	}

	/**
	 * The ID of the authenticated user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the authenticated user.
	 */
	get userName(): string {
		return this._data.login;
	}

	/**
	 * The scopes for which the token is valid.
	 */
	get scopes(): string[] {
		return this._data.scopes;
	}

	/**
	 * The time when the token will expire.
	 *
	 * If this returns null, it means that the token never expires (happens with some old client IDs).
	 */
	get expiryDate(): Date | null {
		if (!this._data.expires_in) {
			return null;
		}

		return new Date(this._obtainmentDate.getTime() + this._data.expires_in * 1000);
	}
}
