/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { WebHookListener } from './WebHookListener';
/** @deprecated Please use the named export `WebHookListener` instead */
const DeprecatedWebHookListener = deprecateClass(
	WebHookListener,
	'Please use the named export `WebHookListener` instead'
);
/** @deprecated Please use the named export `WebHookListener` instead */
type DeprecatedWebHookListener = WebHookListener;
/** @deprecated Please use the named export `WebHookListener` instead */
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
