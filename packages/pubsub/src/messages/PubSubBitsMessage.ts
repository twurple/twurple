import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubBitsMessageData } from './PubSubBitsMessage.external';

/**
 * A message that informs about bits being used in a channel.
 */
@rtfm<PubSubBitsMessage>('pubsub', 'PubSubBitsMessage', 'userId')
export class PubSubBitsMessage extends DataObject<PubSubBitsMessageData> {
	/**
	 * The ID of the user that sent the bits.
	 */
	get userId(): string | undefined {
		return this[rawDataSymbol].data.user_id;
	}

	/**
	 * The name of the user that sent the bits.
	 */
	get userName(): string | undefined {
		return this[rawDataSymbol].data.user_name;
	}

	/**
	 * The full message that was sent with the bits.
	 */
	get message(): string {
		return this[rawDataSymbol].data.chat_message;
	}

	/**
	 * The number of bits that were sent.
	 */
	get bits(): number {
		return this[rawDataSymbol].data.bits_used;
	}

	/**
	 * The total number of bits that were ever sent by the user in the channel.
	 */
	get totalBits(): number {
		return this[rawDataSymbol].data.total_bits_used;
	}

	/**
	 * Whether the cheer was anonymous.
	 */
	get isAnonymous(): boolean {
		return this[rawDataSymbol].data.is_anonymous;
	}
}
