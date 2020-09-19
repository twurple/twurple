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

export { WebHookListenerCertificateConfig } from './WebHookListener';
export { ConnectCompatibleApp, ConnectCompatibleMiddleware } from './ConnectCompatibleApp';
export { CommonConnectionAdapterConfig, ConnectionAdapter } from './Adapters/ConnectionAdapter';
export { EnvPortAdapter, EnvPortAdapterConfig } from './Adapters/EnvPortAdapter';
export { LegacyAdapter, WebHookListenerConfig, WebHookListenerReverseProxyConfig } from './Adapters/LegacyAdapter';
export { ReverseProxyAdapter, ReverseProxyAdapterConfig } from './Adapters/ReverseProxyAdapter';
export { SimpleAdapter, SimpleAdapterConfig } from './Adapters/SimpleAdapter';
export { Subscription } from './Subscriptions/Subscription';
