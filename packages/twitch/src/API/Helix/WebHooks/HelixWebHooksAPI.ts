import BaseAPI from '../../BaseAPI';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixPaginatedRequestWithTotal from '../HelixPaginatedRequestWithTotal';
import HelixWebHookSubscription, { HelixWebHookSubscriptionData } from './HelixWebHookSubscription';

/**
 * The properties describing where and how long a WebHook notification is sent, and how it is signed.
 */
export interface HelixWebHookHubRequestOptions {
	/**
	 * The URL to send notifications to.
	 */
	callbackUrl: string;

	/**
	 * The number of seconds the subscription is valid for. Defaults to 3600 (1 hour). Can be at most 864000 (10 days).
	 */
	validityInSeconds?: number;

	/**
	 * The secret to sign the notification payloads with.
	 */
	secret?: string;
}

/**
 * The properties describing the WebHook to create or remove.
 *
 * @inheritDoc
 */
export interface HelixWebHookHubRequest extends HelixWebHookHubRequestOptions {
	/**
	 * Whether to subscribe or unsubscribe from notifications.
	 */
	mode: HubMode;

	/**
	 * What topic URL to subscribe to or unsubscribe from.
	 */
	topicUrl: string;

	/**
	 * The OAuth scope necessary to subscribe to or unsubscribe from the given topic.
	 */
	scope?: string;
}

/**
 * Whether to subscribe or unsubscribe from notifications.
 */
export type HubMode = 'subscribe' | 'unsubscribe';

/**
 * The API methods that deal with WebHooks.
 *
 * Can be accessed using `client.helix.webHooks` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = await TwitchClient.withCredentials(clientId, accessToken);
 * const accepted = await client.helix.webHooks.subscribeHook('https://api.twitch.tv/helix/streams?user_id=125328655', 'https://example.com');
 * ```
 */
export default class HelixWebHooksAPI extends BaseAPI {
	/**
	 * Retrieves the current WebHook subscriptions for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 */
	async getSubscriptions() {
		return new HelixPaginatedRequestWithTotal(
			{
				url: 'webhooks/subscriptions'
			},
			this._client,
			(data: HelixWebHookSubscriptionData) => new HelixWebHookSubscription(data, this._client));
	}

	/**
	 * Sends an arbitrary request to subscribe to or unsubscribe from an event.
	 *
	 * @expandParams
	 */
	async sendHubRequest(options: HelixWebHookHubRequest) {
		const { mode, callbackUrl, topicUrl, validityInSeconds = 3600, secret, scope } = options;
		await this._client.callAPI({
			url: 'webhooks/hub',
			type: TwitchAPICallType.Helix,
			method: 'POST',
			scope,
			jsonBody: {
				'hub.mode': mode,
				'hub.topic': topicUrl,
				'hub.callback': callbackUrl,
				'hub.lease_seconds': validityInSeconds.toString(),
				'hub.secret': secret
			}
		});
	}

	/**
	 * Subscribes to events representing a user following other users.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to get notifications about the users they will follow.
	 * @param options
	 */
	async subscribeToUserFollowsFrom(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendUserFollowsHubRequest('subscribe', 'from', user, options);
	}

	/**
	 * Subscribes to events representing a user being followed by other users.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to get notifications about the users they will be followed by.
	 * @param options
	 */
	async subscribeToUserFollowsTo(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendUserFollowsHubRequest('subscribe', 'to', user, options);
	}

	/**
	 * Unsubscribes from events representing a user following other users.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to not get any more notifications about the users they will follow.
	 * @param options
	 */
	async unsubscribeFromUserFollowsFrom(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendUserFollowsHubRequest('unsubscribe', 'from', user, options);
	}

	/**
	 * Unsubscribes from events representing a user being followed by other users.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to not get any more notifications about the users they will be followed by.
	 * @param options
	 */
	async unsubscribeFromUserFollowsTo(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendUserFollowsHubRequest('unsubscribe', 'to', user, options);
	}

	/**
	 * Subscribes to events representing a stream changing, e.g. going live, offline or changing its title.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to get notifications about their streams changing.
	 * @param options
	 */
	async subscribeToStreamChanges(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendStreamChangeHubRequest('subscribe', user, options);
	}

	/**
	 * Unsubscribes from events representing a stream changing, e.g. going live, offline or changing its title.
	 *
	 * @expandParams
	 *
	 * @param user The user for which not to get any more notifications about their streams changing.
	 * @param options
	 */
	async unsubscribeFromStreamChanges(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendStreamChangeHubRequest('unsubscribe', user, options);
	}

	/**
	 * Subscribes to events representing a user changing a public setting or their email address.
	 *
	 * @expandParams
	 *
	 * @param user The user for which to get notifications about changing a setting.
	 * @param options
	 * @param withEmail Whether to subscribe to email address changes. This adds the necessary scope to read the email address to the request.
	 */
	async subscribeToUserChanges(user: UserIdResolvable, options: HelixWebHookHubRequestOptions, withEmail: boolean = false) {
		return this._sendUserChangeHubRequest('subscribe', user, options, withEmail);
	}

	/**
	 * Unsubscribes from events representing a user changing a public setting or their email address.
	 *
	 * @expandParams
	 *
	 * @param user The user for which not to get any more notifications about changing a setting.
	 * @param options
	 */
	async unsubscribeFromUserChanges(user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		return this._sendUserChangeHubRequest('unsubscribe', user, options);
	}

	private async _sendUserFollowsHubRequest(mode: HubMode, direction: 'from' | 'to', user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		const userId = extractUserId(user);

		return this.sendHubRequest({
			mode,
			topicUrl: `https://api.twitch.tv/helix/users/follows?first=1&${direction}_id=${userId}`,
			...options
		});
	}

	private async _sendStreamChangeHubRequest(mode: HubMode, user: UserIdResolvable, options: HelixWebHookHubRequestOptions) {
		const userId = extractUserId(user);

		return this.sendHubRequest({
			mode,
			topicUrl: `https://api.twitch.tv/helix/streams?user_id=${userId}`,
			...options
		});
	}

	private async _sendUserChangeHubRequest(mode: HubMode, user: UserIdResolvable, options: HelixWebHookHubRequestOptions, withEmail: boolean = false) {
		const userId = extractUserId(user);

		return this.sendHubRequest({
			mode,
			topicUrl: `https://api.twitch.tv/helix/users?id=${userId}`,
			scope: withEmail ? 'user:read:email' : undefined,
			...options
		});
	}
}
