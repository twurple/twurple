import { mapNullable } from '@d-fischer/shared-utils';
import type { HelixResponse } from '@twurple/api-call';
import { callTwitchApi } from '@twurple/api-call';
import type { HelixExtensionData, UserIdResolvable } from '@twurple/common';
import { extractUserId, HelixExtension } from '@twurple/common';
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
