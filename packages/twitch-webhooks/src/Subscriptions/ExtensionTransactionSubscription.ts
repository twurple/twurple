import type { HelixExtensionTransactionData, HelixResponse } from 'twitch';
import { HelixExtensionTransaction } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
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

	get id(): string {
		return `extension.transaction.${this._extensionId}`;
	}

	protected transformData(response: HelixResponse<HelixExtensionTransactionData>): HelixExtensionTransaction {
		return new HelixExtensionTransaction(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}
}
