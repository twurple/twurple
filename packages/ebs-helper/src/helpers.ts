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

export interface EbsCallConfig extends BaseExternalJwtConfig {
	clientId: string;
}

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

export async function getExtensionGlobalConfiguration(
	config: EbsCallConfig
): Promise<HelixExtensionConfigurationSegment | null> {
	return await getAnyConfigurationSegment(config, 'global');
}

export async function getExtensionBroadcasterConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable
): Promise<HelixExtensionConfigurationSegment | null> {
	return await getAnyConfigurationSegment(config, 'broadcaster', broadcaster);
}

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

export async function setExtensionGlobalConfiguration(
	config: EbsCallConfig,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'global', undefined, content, version);
}

export async function setExtensionBroadcasterConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'broadcaster', broadcaster, content, version);
}

export async function setExtensionDeveloperConfiguration(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	content: string,
	version?: string
): Promise<void> {
	await setAnyConfigurationSegment(config, 'developer', broadcaster, content, version);
}

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
	const jwt = createExternalJwt({ ...config, additionalData: { pubsub_perms: { send: targets } } });

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

export async function sendExtensionPubSubGlobalMessage(config: EbsCallConfig, message: string): Promise<void> {
	await sendAnyExtensionPubSubMessage(config, ['global'], message);
}

export async function sendExtensionPubSubBroadcastMessage(
	config: EbsCallConfig,
	broadcaster: UserIdResolvable,
	message: string
): Promise<void> {
	await sendAnyExtensionPubSubMessage(config, ['broadcast'], message, broadcaster);
}

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
