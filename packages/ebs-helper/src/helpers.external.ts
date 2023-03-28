import { mapOptional } from '@d-fischer/shared-utils';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type EbsCallConfig } from './helpers';

/** @private */
export function getExtensionQuery(config: EbsCallConfig, version: string | undefined) {
	return {
		extension_id: config.clientId,
		extension_version: version
	};
}

/** @private */
export function getExtensionSecretsQuery(config: EbsCallConfig) {
	return {
		extension_id: config.clientId
	};
}

/** @private */
export function getExtensionSecretCreateQuery(config: EbsCallConfig, delay?: number) {
	return {
		extension_id: config.clientId,
		delay: delay?.toString()
	};
}

/** @private */
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

/** @private */
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

/** @private */
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

/** @private */
export function createChatMessageJwtData(broadcaster: UserIdResolvable) {
	return { channel_id: extractUserId(broadcaster) };
}

/** @private */
export function createChatMessageBody(config: EbsCallConfig, extensionVersion: string, text: string) {
	return {
		extension_id: config.clientId,
		extension_version: extensionVersion,
		text
	};
}

/** @private */
export function createPubSubMessageJwtData(broadcaster: UserIdResolvable | undefined, targets: string[]) {
	return { channel_id: mapOptional(broadcaster, extractUserId), pubsub_perms: { send: targets } };
}

/** @private */
export function createPubSubMessageBody(targets: string[], broadcaster: UserIdResolvable | undefined, message: string) {
	return {
		target: targets,
		broadcaster_id: mapOptional(broadcaster, extractUserId),
		message
	};
}
