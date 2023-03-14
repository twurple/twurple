import type { HelixEventSubSubscription, HelixEventSubTransportOptions } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';

/**
 * A subscription to an EventSub event.
 *
 * @hideProtected
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export abstract class EventSubSubscription</** @private */ T = unknown> {
	private _verified: boolean = false;
	private _twitchSubscriptionData?: HelixEventSubSubscription;
	/** @protected */ abstract readonly _cliName: string;
	private _startedFromExistingTwitchSub = false;

	/** @private */
	protected constructor(protected _handler: (obj: T) => void, protected _client: EventSubBase) {}

	/**
	 * Whether the subscription has been verified by Twitch.
	 */
	get verified(): boolean {
		return this._verified;
	}

	/** @private */
	get _twitchId(): string | undefined {
		return this._twitchSubscriptionData?.id;
	}

	/** @private */
	_verify(): void {
		this._verified = true;
	}

	/** @private */
	_handleData(body: Record<string, unknown>): void {
		this._handler(this.transformData(body));
	}

	/**
	 * Activates the subscription.
	 *
	 * You don't have to call this method manually after subscribing, as it's done automatically.
	 * It's only used to reactivate a subscription after calling `.stop()`.
	 *
	 * @param resumeFrom The subscription data from Twitch to check whether the subscription needs to be re-added.
	 */
	start(resumeFrom?: HelixEventSubSubscription): void {
		if (resumeFrom) {
			if (resumeFrom.status === 'enabled') {
				this._startedFromExistingTwitchSub = true;
				this._twitchSubscriptionData = resumeFrom;
				this._client._logger.debug(`Successfully resumed subscription for event: ${this.id}`);
				return;
			}

			this._client._logger.info(`Cycling broken conflicting subscription for event: ${this.id}`);
			this._unsubscribe().then(
				() => this._subscribeAndSave(),
				e => this._client._notifySubscriptionDeleteError(this as EventSubSubscription, e)
			);
		} else {
			this._subscribeAndSave();
		}
		this._startedFromExistingTwitchSub = false;
	}

	/**
	 * Suspends the subscription, not removing it from the listener.
	 */
	suspend(): void {
		if (!this._twitchSubscriptionData) {
			return;
		}
		this._unsubscribe().then(
			() => {
				this._startedFromExistingTwitchSub = false;
				this._verified = false;
				this._twitchSubscriptionData = undefined;
			},
			e => this._client._notifySubscriptionDeleteError(this as EventSubSubscription, e)
		);
	}

	/**
	 * Deactivates the subscription and removes it from the listener.
	 */
	stop(): void {
		this.suspend();
		this._client._dropSubscription(this.id);
	}

	/**
	 * Migrates the subscription from legacy secrets to modern secrets.
	 */
	async migrate(): Promise<void> {
		if (this._client._legacySecrets !== 'migrate') {
			throw new Error(
				"The `.migrate()` method is not available unless the legacySecrets options is set to 'migrate'"
			);
		}
		if (!this._startedFromExistingTwitchSub) {
			this._client._logger.warn(`Tried to migrate subscription ${this.id} but it was already migrated`);
			return;
		}
		await this._unsubscribe().then(
			async () => {
				this._verified = false;
				this._twitchSubscriptionData = undefined;
				this._startedFromExistingTwitchSub = false;

				await this._subscribe().then(
					data => {
						this._twitchSubscriptionData = data;
						this._client._registerTwitchSubscription(this as EventSubSubscription, data);
					},
					e => {
						this._client._logger.error(
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							`Subscription ${this.id} failed to subscribe: ${(e as Error).message ?? e}`
						);
						this._client._notifySubscriptionCreateError(this as EventSubSubscription, e);
					}
				);
			},
			e => this._client._notifySubscriptionDeleteError(this as EventSubSubscription, e)
		);
	}

	/**
	 * Outputs the base command to execute for testing the subscription using the Twitch CLI.
	 *
	 * Some additional parameters, like the target user, may be required.
	 */
	async getCliTestCommand(): Promise<string> {
		return await this._client._getCliTestCommandForSubscription(this as EventSubSubscription);
	}

	/**
	 * Whether the subscription uses a legacy secret.
	 *
	 * You can use this property to check whether any subscription still has to be migrated from legacy secrets.
	 */
	get usesLegacySecret(): boolean {
		if (this._client._legacySecrets === 'migrate') {
			return this._startedFromExistingTwitchSub;
		}

		return this._client._legacySecrets;
	}

	protected async _getTransportOptions(): Promise<HelixEventSubTransportOptions> {
		return await this._client._getTransportOptionsForSubscription(this as EventSubSubscription);
	}

	/** @private */
	abstract get id(): string;

	/** @private */
	abstract get authUserId(): string | null;

	protected abstract _subscribe(): Promise<HelixEventSubSubscription>;

	protected abstract transformData(response: unknown): T;

	private _subscribeAndSave() {
		this._subscribe().then(
			data => {
				this._twitchSubscriptionData = data;
				this._client._registerTwitchSubscription(this as EventSubSubscription, data);
			},
			e => {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				this._client._logger.error(`Subscription ${this.id} failed to subscribe: ${(e as Error).message ?? e}`);
				this._client._notifySubscriptionCreateError(this as EventSubSubscription, e);
			}
		);
	}

	private async _unsubscribe() {
		if (this._twitchSubscriptionData) {
			await this._client._apiClient.eventSub.deleteSubscription(this._twitchSubscriptionData.id);
		}
		this._client._dropTwitchSubscription(this.id);
		this._client._notifySubscriptionDeleteSuccess(this as EventSubSubscription);
	}
}
