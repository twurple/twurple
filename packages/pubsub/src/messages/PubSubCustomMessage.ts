import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/**
 * A message in response to a subscription to a custom topic.
 */
@rtfm('pubsub', 'PubSubCustomMessage')
export class PubSubCustomMessage extends DataObject<unknown> {
	/**
	 * The message data.
	 */
	get data(): unknown {
		return this[rawDataSymbol];
	}
}
