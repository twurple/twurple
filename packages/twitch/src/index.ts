/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { ApiClient } from './ApiClient';
/** @deprecated Use the named export `ApiClient` instead. */
const DeprecatedTwitchClient = deprecateClass(
	ApiClient,
	`[twitch] The default export has been deprecated. Use the named export instead:

\timport { ApiClient } from 'twitch';`
);
/** @deprecated Use the named export `ApiClient` instead. */
// eslint-disable-next-line @typescript-eslint/no-redeclare
type DeprecatedTwitchClient = ApiClient;
/** @deprecated Use the named export `ApiClient` instead. */
export default DeprecatedTwitchClient;
export { ApiClient };

export { ApiConfig } from './ApiClient';

export { ConfigError } from './Errors/ConfigError';
export { HellFreezesOverError } from './Errors/HellFreezesOverError';
export { InvalidTokenTypeError } from './Errors/InvalidTokenTypeError';
export { NoSubscriptionProgramError } from './Errors/NoSubscriptionProgramError';
export { StreamNotLiveError } from './Errors/StreamNotLiveError';

export { Subscription } from './API/Kraken/Subscription';

export {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CheermoteList,
	CheermoteScale,
	CheermoteState
} from './API/Kraken/Bits/CheermoteList';

export { Channel } from './API/Kraken/Channel/Channel';
export { ChannelFollow } from './API/Kraken/Channel/ChannelFollow';
export { ChannelPlaceholder } from './API/Kraken/Channel/ChannelPlaceholder';
export { ChannelSubscription } from './API/Kraken/Channel/ChannelSubscription';
export { EmoteSetList } from './API/Kraken/Channel/EmoteSetList';
export { PrivilegedChannel } from './API/Kraken/Channel/PrivilegedChannel';

export { Stream, StreamType } from './API/Kraken/Stream/Stream';

export { ChattersList } from './API/Unsupported/ChattersList';

export { PrivilegedUser } from './API/Kraken/User/PrivilegedUser';
export { User } from './API/Kraken/User/User';
export { UserBlock } from './API/Kraken/User/UserBlock';
export { UserFollow } from './API/Kraken/User/UserFollow';
export { UserSubscription } from './API/Kraken/User/UserSubscription';

export { HelixPaginatedRequest } from './API/Helix/HelixPaginatedRequest';
export { HelixPaginatedResult, HelixPaginatedResultWithTotal } from './API/Helix/HelixPaginatedResult';
export { HelixResponse } from './API/Helix/HelixResponse';

export { HelixBitsLeaderboard } from './API/Helix/Bits/HelixBitsLeaderboard';
export { HelixBitsLeaderboardEntry } from './API/Helix/Bits/HelixBitsLeaderboardEntry';

export { HelixClip } from './API/Helix/Clip/HelixClip';

export {
	HelixExtensionTransaction,
	HelixExtensionTransactionData
} from './API/Helix/Extensions/HelixExtensionTransaction';

export { HelixGame } from './API/Helix/Game/HelixGame';

export { HelixBan } from './API/Helix/Moderation/HelixBan';
export { HelixBanEvent, HelixBanEventData } from './API/Helix/Moderation/HelixBanEvent';
export { HelixModerator } from './API/Helix/Moderation/HelixModerator';
export { HelixModeratorEvent } from './API/Helix/Moderation/HelixModeratorEvent';

export { HelixHypeTrainContribution } from './API/Helix/HypeTrain/HelixHypeTrainContribution';
export { HelixHypeTrainEvent, HelixHypeTrainEventData } from './API/Helix/HypeTrain/HelixHypeTrainEvent';

export { HelixSubscription } from './API/Helix/Subscriptions/HelixSubscription';
export { HelixSubscriptionEvent, HelixSubscriptionEventData } from './API/Helix/Subscriptions/HelixSubscriptionEvent';

export { HelixStream, HelixStreamData, HelixStreamType } from './API/Helix/Stream/HelixStream';

export { HelixFollow, HelixFollowData } from './API/Helix/User/HelixFollow';
export { HelixPrivilegedUser } from './API/Helix/User/HelixPrivilegedUser';
export { HelixBroadcasterType, HelixUser, HelixUserData, HelixUserType } from './API/Helix/User/HelixUser';

export { HelixVideo } from './API/Helix/Video/HelixVideo';

export { HelixWebHookHubRequestOptions } from './API/Helix/WebHooks/HelixWebHooksApi';

export { ChatBadgeList } from './API/Badges/ChatBadgeList';
export { ChatBadgeSet } from './API/Badges/ChatBadgeSet';
export { ChatBadgeScale, ChatBadgeVersion } from './API/Badges/ChatBadgeVersion';

export { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from './Toolkit/UserTools';

export { HttpStatusCodeError, TwitchApiCallType, TwitchApiCallOptions } from 'twitch-api-call';
/** @deprecated Import `HttpStatusCodeError` instead. */
export { HttpStatusCodeError as HTTPStatusCodeError } from 'twitch-api-call';
/** @deprecated Import `TwitchApiCallType` instead. */
export { TwitchApiCallType as TwitchAPICallType } from 'twitch-api-call';
/** @deprecated Import `TwitchApiCallOptions` instead. */
export { TwitchApiCallOptions as TwitchAPICallOptions } from 'twitch-api-call';

export {
	AccessToken,
	AuthProvider,
	AuthProviderTokenType,
	InvalidTokenError,
	StaticAuthProvider,
	ClientCredentialsAuthProvider,
	RefreshableAuthProvider,
	RefreshConfig,
	TokenInfo
} from 'twitch-auth';
export { CommercialLength } from './API/CommercialLength';
