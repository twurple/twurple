/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { PubSubClient } from './PubSubClient';
/** @deprecated Use the named export `PubSubClient` instead. */
const DeprecatedPubSubClient = deprecateClass(
	PubSubClient,
	`[twitch-pubsub-client] The default export has been deprecated. Use the named export instead:

\timport { PubSubClient } from 'twitch-pubsub-client';`
);
/** @deprecated Use the named export `PubSubClient` instead. */
type DeprecatedPubSubClient = PubSubClient;
/** @deprecated Use the named export `PubSubClient` instead. */
export default DeprecatedPubSubClient;
export { PubSubClient };

export { PubSubListener } from './PubSubListener';
export { BasicPubSubClient } from './BasicPubSubClient';
export { SingleUserPubSubClient } from './SingleUserPubSubClient';

export * from './PubSubPacket';

export { PubSubMessage } from './Messages/PubSubMessage';
export { PubSubBitsMessage } from './Messages/PubSubBitsMessage';
export { PubSubBitsBadgeUnlockMessage } from './Messages/PubSubBitsBadgeUnlockMessage';
export { PubSubChatModActionMessage } from './Messages/PubSubChatModActionMessage';
export { PubSubRedemptionMessage } from './Messages/PubSubRedemptionMessage';
export { PubSubSubscriptionMessage } from './Messages/PubSubSubscriptionMessage';
export { PubSubWhisperMessage } from './Messages/PubSubWhisperMessage';

export { LogLevel } from '@d-fischer/logger';
