import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/**
 * A user in chat.
 */
@Cacheable
@rtfm<ChatUser>('twitch-chat-client', 'ChatUser', 'userId')
export class ChatUser {
	@Enumerable(false) private readonly _userData: Map<string, string>;
	private readonly _userName: string;

	/** @private */
	constructor(userName: string, userData: Map<string, string> | undefined) {
		this._userName = userName.toLowerCase();
		this._userData = userData ? new Map<string, string>(userData) : new Map<string, string>();
	}

	private _parseBadgesLike(badgesLikeStr?: string): Map<string, string> {
		if (!badgesLikeStr) {
			return new Map<string, string>();
		}

		return new Map(badgesLikeStr.split(',').map(badge => badge.split('/', 2) as [string, string]));
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this._userData.get('display-name') ?? this._userName;
	}

	/**
	 * The color the user chose to display in chat.
	 *
	 * Returns null if the user didn't choose a color. In this case, you should generate your own color.
	 */
	get color(): string | undefined {
		return this._userData.get('color');
	}

	/**
	 * The badges of the user. Returned as a map that maps the badge category to the detail.
	 */
	@CachedGetter()
	get badges(): Map<string, string> {
		const badgesStr = this._userData.get('badges');

		return this._parseBadgesLike(badgesStr);
	}

	/**
	 * The badge info of the user. Returned as a map that maps the badge category to the detail.
	 */
	@CachedGetter()
	get badgeInfo(): Map<string, string> {
		const badgeInfoStr = this._userData.get('badge-info');

		return this._parseBadgesLike(badgeInfoStr);
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string | undefined {
		return this._userData.get('user-id');
	}

	/**
	 * The type of the user.
	 * Possible values are undefined, 'mod', 'global_mod', 'admin' and 'staff'.
	 */
	get userType(): string | undefined {
		return this._userData.get('user-type');
	}

	/**
	 * Whether the user is the broadcaster.
	 */
	get isBroadcaster(): boolean {
		return this.badges.has('broadcaster');
	}

	/**
	 * Whether the user is subscribed to the channel.
	 */
	get isSubscriber(): boolean {
		return this.badges.has('subscriber') || this.isFounder;
	}

	/**
	 * Whether the user is a Founder of the channel.
	 */
	get isFounder(): boolean {
		return this.badges.has('founder');
	}

	/**
	 * Whether the user is a moderator of the channel.
	 */
	get isMod(): boolean {
		return this.badges.has('moderator');
	}

	/**
	 * Whether the user is a VIP in the channel.
	 */
	get isVip(): boolean {
		return this.badges.has('vip');
	}
}
