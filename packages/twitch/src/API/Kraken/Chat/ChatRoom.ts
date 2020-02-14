/** @private */
import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

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

export default class ChatRoom {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChatRoomData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the chat room.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * The user ID of the chat room owner.
	 */
	get ownerId() {
		return this._data.owner_id;
	}

	/**
	 * Retrieves the user data of the chat room owner.
	 */
	async getOwner() {
		return this._client.kraken.users.getUser(this._data.owner_id);
	}

	/**
	 * The name of the chat room.
	 */
	get name() {
		return this._data.name;
	}

	/**
	 * The topic of the chat room.
	 */
	get topic() {
		return this._data.topic;
	}

	/**
	 * Whether the chat room is previewable.
	 */
	get isPreviewable() {
		return this._data.is_previewable;
	}

	/**
	 * The minimum role allowed to enter this chat room.
	 */
	get minRole() {
		return this._data.minimum_allowed_role;
	}

	/**
	 * The name of the IRC channel that corresponds to this chat room.
	 */
	get ircName() {
		return `#chatrooms:${this._data.owner_id}:${this._data._id}`;
	}
}
