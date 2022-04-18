import { mapNullable, mapOptional } from '@d-fischer/shared-utils';
import type { HelixResponse } from '@twurple/api-call';
import { callTwitchApi } from '@twurple/api-call';
import type { HelixExtensionData, UserIdResolvable } from '@twurple/common';
import { extractUserId, HelixExtension } from '@twurple/common';
import type {
	HelixExtensionConfigurationSegmentData,
	HelixExtensionConfigurationSegmentName
} from './classes/HelixExtensionConfigurationSegment';
import { HelixExtensionConfigurationSegment } from './classes/HelixExtensionConfigurationSegment';
import type { HelixExtensionSecretListData } from './classes/HelixExtensionSecretList';
import { HelixExtensionSecretList } from './classes/HelixExtensionSecretList';
import type { BaseExternalJwtConfig } from './jwt';
import { createExternalJwt } from './jwt';

/**
 * Configuration for an EBS call.
 *
 * @inheritDoc
 */
export interface EbsCallConfig extends BaseExternalJwtConfig {
	/**
	 * The client ID of the extension.
	 */
	clientId: string;
}

/**
 * Feetches details about the extension.
 *
 * @param config
 * @param version The extension version to fetch details for.
 *
 * If not given, fetches the details of the latest released version.
 *
 * @expandParams
 */
export async function getExtension(config: EbsCallConfig, version?: string): Promise<HelixExtension | null> {
	const jwt = createExternalJwt(config);

	const result = await callTwitchApi<HelixResponse<HelixExtensionData>>(
		{
			url: 'extensions',
			query: {
				extension_id: config.clientId,
				extension_version: version
			}
		},
		config.clientId,
		jwt
	);

	return mapNullable(result.data[0], data => new HelixExtension(data));
}

/**
 * Fetches the extension's secrets.
 *
 * @param config
 *
 * @expandParams
 */
export async function getExtensionSecrets(config: EbsCallConfig): Promise<HelixExtensionSecretList> {
	const jwt = createExternalJwt(config);

	const result = await callTwitchApi<HelixResponse<HelixExtensionSecretListData>>(
		{
			url: 'extensions/jwt/secrets',
			query: {
				extension_id: config.clientId
			}
		},
		config.clientId,
		jwt
	);

	return new HelixExtensionSecretList(result.data[0]);
}

/**
 * Creates a new extension secret.
 *
 * @param config
 * @param delay The delay after which extension frontends will use the new secret. Defaults to 300 seconds.
 *
 * @expandParams
 */
export async function createExtensionSecret(config: EbsCallConfig, delay?: number): Promise<HelixExtensionSecretList> {
	const jwt = createExternalJwt(config);

	const result = await callTwitchApi<HelixResponse<HelixExtensionSecretListData>>(
		{
			url: 'extensions/jwt/secrets',
			method: 'POST',
			query: {
				extension_id: config.clientId,
				delay: delay?.toString()
			}
		},
		config.clientId,
		jwt
	);

	return new HelixExtensionSecretList(result.data[0]);
}

/**
 * Sets a new required configuration version for a specific broadcaster using an extension.
 *
 * @param config
 * @param broadcaster The broadcaster to update the required configuration version for.
 * @param version The extension's version.
 * @param configVersion The new required configuration version.
 *
 * @expandParams
 */
export async function setExtensionRequiredConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	version: string,
	configVersion: string
): Promise<void> {
	const jwt = createExternalJwt(config);

	await callTwitchApi(
		{
			url: 'extensions/required_configuration',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			},
			jsonBody: {
				extension_id: config.clientId,
				extension_version: version,
				required_configuration: configVersion
			}
		},
		config.clientId,
		jwt
	);
}

/** @private */
async function getAnyConfigurationSegment(
	config: EbsCallConfig,
	segment: HelixExtensionConfigurationSegmentName,
	broadcaster?: UserIdResolvable
): Promise<HelixExtensionConfigurationSegment | null> {
	const jwt = createExternalJwt(config);

	const result = await callTwitchApi<HelixResponse<HelixExtensionConfigurationSegmentData>>(
		{
			url: 'extensions/configurations',
			query: {
				extension_id: config.clientId,
				segment,
				broadcaster_id: mapOptional(broadcaster, extractUserId)
			}
		},
		config.clientId,
		jwt
	);

	return mapNullable(result.data[0], data => new HelixExtensionConfigurationSegment(data));
}

/**
 * Fetches the global configuration of an extension.
 *
 * @param config
 *
 * @expandParams
 */
export async function getExtensionGlobalConfiguration(
	config: EbsCallConfig
): Promise<HelixExtensionConfigurationSegment | null> {
	return await getAnyConfigurationSegment(config, 'global');
}

/**
 * Fetches the broadcaster configuration of an extension for a broadcaster.
 *
 * @param config
 * @param broadcaster The broadcaster to fetch the configuration for.
 *
 * @expandParams
 */
export async function getExtensionBroadcasterConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable
): Promise<HelixExtensionConfigurationSegment | null> {
	return await getAnyConfigurationSegment(config, 'broadcaster', broadcaster);
}

/**
 * Fetches the developer configuration of an extension for a broadcaster.
 *
 * @param config
 * @param broadcaster The broadcaster to fetch the configuration for.
 *
 * @expandParams
 */
export async function getExtensionDeveloperConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable
): Promise<HelixExtensionConfigurationSegment | null> {
	return await getAnyConfigurationSegment(config, 'developer', broadcaster);
}

/** @private */
async function setAnyConfigurationSegment(
	config: EbsCallConfig,
	segment: HelixExtensionConfigurationSegmentName,
	broadcaster?: UserIdResolvable,
	version?: string,
	content?: string
): Promise<void> {
	const jwt = createExternalJwt(config);

	await callTwitchApi<HelixResponse<HelixExtensionConfigurationSegmentData>>(
		{
			url: 'extensions/configurations',
			method: 'PUT',
			jsonBody: {
				extension_id: config.clientId,
				segment,
				broadcaster_id: mapOptional(broadcaster, extractUserId),
				version,
				content
			}
		},
		config.clientId,
		jwt
	);
}

/**
 * Changes the global configuration of an extension.
 *
 * @param config
 * @param content The new configuration content.
 * @param version The configuration version associated with the new configuration.
 *
 * @expandParams
 */
export async function setExtensionGlobalConfiguration(
	config: EbsCallConfig,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'global', undefined, content, version);
}

/**
 * Changes the broadcaster configuration of an extension for a broadcaster.
 *
 * @param config
 * @param broadcaster The broadcaster to change the configuration for.
 * @param content The new configuration content.
 * @param version The configuration version associated with the new configuration.
 *
 * @expandParams
 */
export async function setExtensionBroadcasterConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'broadcaster', broadcaster, content, version);
}

/**
 * Changes the developer configuration of an extension for a broadcaster.
 *
 * @param config
 * @param broadcaster The broadcaster to change the configuration for.
 * @param content The new configuration content.
 * @param version The configuration version associated with the new configuration.
 *
 * @expandParams
 */
export async function setExtensionDeveloperConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'developer', broadcaster, content, version);
}

/**
 * Sends a chat message in the name of the extension to a channel.
 *
 * @param config
 * @param broadcaster The broadcaster to send a chat message to.
 * @param extensionVersion The version of the extension.
 * @param text The text to send to the channel.
 *
 * @expandParams
 */
export async function sendExtensionChatMessage(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	extensionVersion: string,
	text: string
): Promise<void> {
	const broadcasterId = extractUserId(broadcaster);
	const jwt = createExternalJwt({ ...config, additionalData: { channel_id: broadcasterId } });

	await callTwitchApi(
		{
			url: 'extensions/chat',
			method: 'POST',
			query: {
				broadcaster_id: broadcasterId
			},
			jsonBody: {
				extension_id: config.clientId,
				extension_version: extensionVersion,
				text
			}
		},
		config.clientId,
		jwt
	);
}

/** @private */
async function sendAnyExtensionPubSubMessage(
	config: EbsCallConfig,
	targets: string[],
	message: string,
	broadcaster?: UserIdResolvable
): Promise<void> {
	const broadcasterId = mapOptional(broadcaster, extractUserId);
	const jwt = createExternalJwt({
		...config,
		additionalData: { channel_id: broadcasterId, pubsub_perms: { send: targets } }
	});

	await callTwitchApi(
		{
			url: 'extensions/pubsub',
			method: 'POST',
			jsonBody: {
				target: targets,
				broadcaster_id: broadcasterId,
				message
			}
		},
		config.clientId,
		jwt
	);
}

/**
 * Sends an Extension PubSub message to all users of an extension across all channels.
 *
 * @param config
 * @param message The content of the message.
 *
 * @expandParams
 */
export async function sendExtensionPubSubGlobalMessage(config: EbsCallConfig, message: string): Promise<void> {
	await sendAnyExtensionPubSubMessage(config, ['global'], message);
}

/**
 * Sends an Extension PubSub message to all users of an extension in a channel.
 *
 * @param config
 * @param broadcaster The broadcaster to broadcast the message to.
 * @param message The content of the message.
 *
 * @expandParams
 */
export async function sendExtensionPubSubBroadcastMessage(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	message: string
): Promise<void> {
	await sendAnyExtensionPubSubMessage(config, ['broadcast'], message, broadcaster);
}

/**
 * Sends an Extension PubSub message to specified users in the context of a channel.
 *
 * @param config
 * @param broadcaster The broadcaster that is used as the context of the message.
 * @param targets The user(s) you want to send the message to.
 * @param message The content of the message.
 *
 * @expandParams
 */
export async function sendExtensionPubSubWhisperMessage(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	targets: UserIdResolvable | UserIdResolvable[],
	message: string
): Promise<void> {
	const targetsArray = Array.isArray(targets) ? targets : [targets];
	await sendAnyExtensionPubSubMessage(
		config,
		targetsArray.map(u => `whisper-${extractUserId(u)}`),
		message,
		broadcaster
	);
}
