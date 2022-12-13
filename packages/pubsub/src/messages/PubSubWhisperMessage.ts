import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubWhisperMessageData } from './PubSubWhisperMessage.external';

/**
 * A message informing about a whisper being received from another user.
 */
@rtfm<PubSubWhisperMessage>('pubsub', 'PubSubWhisperMessage', 'senderId')
export class PubSubWhisperMessage extends DataObject<PubSubWhisperMessageData> {
	/**
	 * The message text.
	 */
	get text(): string {
		return this[rawDataSymbol].data_object.body;
	}

	/**
	 * The ID of the user who sent the whisper.
	 */
	get senderId(): string {
		return this[rawDataSymbol].data_object.from_id.toString();
	}

	/**
	 * The name of the user who sent the whisper.
	 */
	get senderName(): string {
		return this[rawDataSymbol].data_object.tags.login;
	}

	/**
	 * The display name of the user who sent the whisper.
	 */
	get senderDisplayName(): string {
		return this[rawDataSymbol].data_object.tags.display_name;
	}
}
