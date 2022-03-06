import { mapNullable } from '@d-fischer/shared-utils';
import type { HelixResponse } from '@twurple/api-call';
import { callTwitchApi } from '@twurple/api-call';
import type { HelixExtensionData } from '@twurple/common';
import { HelixExtension } from '@twurple/common';
import type { BaseExternalJwtConfig } from './jwt';
import { createExternalJwt } from './jwt';

export interface EbsCallConfig extends BaseExternalJwtConfig {
	clientId: string;
}

export async function getExtension(config: EbsCallConfig): Promise<HelixExtension | null> {
	const jwt = createExternalJwt(config);

	const result = await callTwitchApi<HelixResponse<HelixExtensionData>>(
		{
			url: 'extensions',
			query: {
				extension_id: config.clientId
			}
		},
		config.clientId,
		jwt
	);

	return mapNullable(result.data[0], data => new HelixExtension(data));
}

export async function getExtensionVersion(version: string, config: EbsCallConfig): Promise<HelixExtension | null> {
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
