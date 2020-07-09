/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { PubSubClient } from './PubSubClient';
/** @deprecated Please use the named export `PubSubClient` instead */
const DeprecatedPubSubClient = deprecateClass(PubSubClient, 'Please use the named export `PubSubClient` instead');
/** @deprecated Please use the named export `PubSubClient` instead */
type DeprecatedPubSubClient = PubSubClient;
/** @deprecated Please use the named export `PubSubClient` instead */
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
