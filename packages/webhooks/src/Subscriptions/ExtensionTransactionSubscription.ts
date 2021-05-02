import type { HelixExtensionTransactionData, HelixResponse } from '@twurple/api';
import { HelixExtensionTransaction } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('webhooks', 'Subscription')
export class ExtensionTransactionSubscription extends Subscription<HelixExtensionTransaction> {
	constructor(
		handler: (data: HelixExtensionTransaction) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _extensionId: string
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
		await this._client._apiClient.helix.webHooks.subscribeToExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		await this._client._apiClient.helix.webHooks.unsubscribeFromExtensionTransactions(
			this._extensionId,
			await this._getOptions()
		);
	}
}
