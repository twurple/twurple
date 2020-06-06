import { HelixExtensionTransaction, HelixResponse } from 'twitch';
import { HelixExtensionTransactionData } from 'twitch/lib/API/Helix/Extensions/HelixExtensionTransaction';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @private
 */
export default class ExtensionTransactionSubscription extends Subscription<HelixExtensionTransaction> {
	constructor(
		private readonly _extensionId: string,
		handler: (data: HelixExtensionTransaction) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `extension.transaction.${this._extensionId}`;
	}

	protected transformData(response: HelixResponse<HelixExtensionTransactionData>) {
		return new HelixExtensionTransaction(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToExtensionTransactions(
			this._extensionId,
			this._options
		);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromExtensionTransactions(
			this._extensionId,
			this._options
		);
	}
}
