/** @private */
import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { User } from '../User/User';

export type ChatRoomRole = 'EVERYONE' | 'SUBSCRIBER' | 'MODERATOR';

/** @private */
export interface ChatRoomData {
	_id: string;
	owner_id: string;
	name: string;
	topic: string;
	is_previewable: boolean;
	minimum_allowed_role: ChatRoomRole;
}

export class ChatRoom {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: ChatRoomData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the chat room.
	 */
	get id(): string {
		return this._data._id;
	}

	/**
	 * The user ID of the chat room owner.
	 */
	get ownerId(): string {
		return this._data.owner_id;
	}

	/**
	 * Retrieves the user data of the chat room owner.
	 */
	async getOwner(): Promise<User> {
		return this._client.kraken.users.getUser(this._data.owner_id);
	}

	/**
	 * The name of the chat room.
	 */
	get name(): string {
		return this._data.name;
	}

	/**
	 * The topic of the chat room.
	 */
	get topic(): string {
		return this._data.topic;
	}

	/**
	 * Whether the chat room is previewable.
	 */
	get isPreviewable(): boolean {
		return this._data.is_previewable;
	}

	/**
	 * The minimum role allowed to enter this chat room.
	 */
	get minRole(): ChatRoomRole {
		return this._data.minimum_allowed_role;
	}

	/**
	 * The name of the IRC channel that corresponds to this chat room.
	 */
	get ircName(): string {
		return `#chatrooms:${this._data.owner_id}:${this._data._id}`;
	}
}
