import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixBlockedTermData } from '../../interfaces/endpoints/moderation.external';

/**
 * Information about a word or phrase blocked in a broadcaster's channel.
 */
@rtfm<HelixBlockedTerm>('api', 'HelixBlockedTerm', 'id')
export class HelixBlockedTerm extends DataObject<HelixBlockedTermData> {
	/**
	 * The ID of the broadcaster that owns the list of blocked terms.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The date and time of when the term was blocked.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date and time of when the blocked term is set to expire. After the block expires, users will be able to use the term in the broadcaster’s chat room.
	 * Is `null` if the term was added manually or permanently blocked by AutoMod.
	 */
	get expirationDate(): Date | null {
		return this[rawDataSymbol].expires_at ? new Date(this[rawDataSymbol].expires_at) : null;
	}

	/**
	 * An ID that uniquely identifies this blocked term.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the moderator that blocked the word or phrase from being used in the broadcaster’s chat room.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * The blocked word or phrase.
	 */
	get text(): string {
		return this[rawDataSymbol].text;
	}

	/**
	 * The date and time of when the term was updated.
	 */
	get updatedDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}
}
