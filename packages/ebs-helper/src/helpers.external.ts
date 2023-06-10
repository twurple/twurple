import { mapOptional } from '@d-fischer/shared-utils';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type EbsCallConfig } from './helpers';

/** @internal */
export function getExtensionQuery(config: EbsCallConfig, version: string | undefined) {
	return {
		extension_id: config.clientId,
		extension_version: version
	};
}

/** @internal */
export function getExtensionSecretsQuery(config: EbsCallConfig) {
	return {
		extension_id: config.clientId
	};
}

/** @internal */
export function getExtensionSecretCreateQuery(config: EbsCallConfig, delay?: number) {
	return {
		extension_id: config.clientId,
		delay: delay?.toString()
	};
}

/** @internal */
export function createExtensionRequiredConfigurationBody(
	config: EbsCallConfig,
	version: string,
	configVersion: string
) {
	return {
		extension_id: config.clientId,
		extension_version: version,
		required_configuration: configVersion
	};
}

/** @internal */
export function createConfigurationSegmentQuery(
	config: EbsCallConfig,
	segment: 'global' | 'broadcaster' | 'developer',
	broadcaster?: UserIdResolvable
) {
	return {
		extension_id: config.clientId,
		segment,
		broadcaster_id: mapOptional(broadcaster, extractUserId)
	};
}

/** @internal */
export function createConfigurationSegmentBody(
	config: EbsCallConfig,
	segment: 'global' | 'broadcaster' | 'developer',
	broadcaster?: UserIdResolvable,
	content?: string,
	version?: string
) {
	return {
		extension_id: config.clientId,
		segment,
		broadcaster_id: mapOptional(broadcaster, extractUserId),
		content,
		version
	};
}

/** @internal */
export function createChatMessageJwtData(broadcaster: UserIdResolvable) {
	return { channel_id: extractUserId(broadcaster) };
}

/** @internal */
export function createChatMessageBody(config: EbsCallConfig, extensionVersion: string, text: string) {
	return {
		extension_id: config.clientId,
		extension_version: extensionVersion,
		text
	};
}

/** @internal */
export function createPubSubGlobalMessageJwtData() {
	return { channel_id: 'all', pubsub_perms: { send: ['global'] } };
}

/** @internal */
export function createPubSubGlobalMessageBody(message: string) {
	return {
		is_global_broadcast: true,
		target: ['global'],
		message
	};
}

/** @internal */
export function createPubSubMessageJwtData(broadcaster: UserIdResolvable, targets: string[]) {
	return { channel_id: extractUserId(broadcaster), pubsub_perms: { send: targets } };
}

/** @internal */
export function createPubSubMessageBody(targets: string[], broadcaster: UserIdResolvable, message: string) {
	return {
		target: targets,
		broadcaster_id: extractUserId(broadcaster),
		message
	};
}
