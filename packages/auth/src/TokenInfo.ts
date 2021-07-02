/** @private */
import { mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

export interface TokenInfoData {
	client_id: string;
	login?: string;
	scopes: string[];
	user_id?: string;
	expires_in?: number;
}

/**
 * Information about an access token.
 */
@rtfm<TokenInfo>('auth', 'TokenInfo', 'clientId')
export class TokenInfo extends DataObject<TokenInfoData> {
	private readonly _obtainmentDate: Date;

	/** @private */
	constructor(data: TokenInfoData) {
		super(data);
		this._obtainmentDate = new Date();
	}

	/**
	 * The client ID.
	 */
	get clientId(): string {
		return this[rawDataSymbol].client_id;
	}

	/**
	 * The ID of the authenticated user.
	 */
	get userId(): string | null {
		return this[rawDataSymbol].user_id ?? null;
	}

	/**
	 * The name of the authenticated user.
	 */
	get userName(): string | null {
		return this[rawDataSymbol].login ?? null;
	}

	/**
	 * The scopes for which the token is valid.
	 */
	get scopes(): string[] {
		return this[rawDataSymbol].scopes;
	}

	/**
	 * The time when the token will expire.
	 *
	 * If this returns null, it means that the token never expires (happens with some old client IDs).
	 */
	get expiryDate(): Date | null {
		return mapNullable(this[rawDataSymbol].expires_in, v => new Date(this._obtainmentDate.getTime() + v * 1000));
	}
}
