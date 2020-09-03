import { HelixExtensionTransaction, HelixResponse } from 'twitch';
import { HelixExtensionTransactionData } from 'twitch/lib/API/Helix/Extensions/HelixExtensionTransaction';
import { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class ExtensionTransactionSubscription extends Subscription<HelixExtensionTransaction> {
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
		return new HelixExtensionTransaction(response.data[0], this._client._apiClient);
	}

	protected async _subscribe() {
		return this._client._apiClient.helix.webHooks.subscribeToExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		return this._client._apiClient.helix.webHooks.unsubscribeFromExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}
}
