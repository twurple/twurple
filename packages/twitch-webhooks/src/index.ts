/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { WebHookListener } from './WebHookListener';

/** @deprecated Use the named export `WebHookListener` instead. */
const DeprecatedWebHookListener = deprecateClass(
	WebHookListener,
	`[twitch-webhooks] The default export has been deprecated. Use the named export instead:

\timport { WebHookListener } from 'twitch-webhooks';`
);
/** @deprecated Use the named export `WebHookListener` instead. */
// eslint-disable-next-line @typescript-eslint/no-redeclare
type DeprecatedWebHookListener = WebHookListener;
/** @deprecated Use the named export `WebHookListener` instead. */
export default DeprecatedWebHookListener;
export { WebHookListener };

export type { WebHookListenerCertificateConfig } from './WebHookListener';
export type { ConnectCompatibleApp, ConnectCompatibleMiddleware } from './ConnectCompatibleApp';
export { ConnectionAdapter } from './Adapters/ConnectionAdapter';
export type { CommonConnectionAdapterConfig, ConnectionAdapterOverrideOptions } from './Adapters/ConnectionAdapter';
export { EnvPortAdapter } from './Adapters/EnvPortAdapter';
export type { EnvPortAdapterConfig } from './Adapters/EnvPortAdapter';
export { LegacyAdapter } from './Adapters/LegacyAdapter';
export type { WebHookListenerConfig, WebHookListenerReverseProxyConfig } from './Adapters/LegacyAdapter';
export { ReverseProxyAdapter } from './Adapters/ReverseProxyAdapter';
export type { ReverseProxyAdapterConfig } from './Adapters/ReverseProxyAdapter';
export { SimpleAdapter } from './Adapters/SimpleAdapter';
export type { SimpleAdapterConfig } from './Adapters/SimpleAdapter';
export { Subscription } from './Subscriptions/Subscription';
