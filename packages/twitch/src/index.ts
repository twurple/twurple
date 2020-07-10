/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { TwitchClient } from './TwitchClient';
/** @deprecated Use the named export `TwitchClient` instead. */
const DeprecatedTwitchClient = deprecateClass(TwitchClient, 'Use the named export `TwitchClient` instead.');
/** @deprecated Use the named export `TwitchClient` instead. */
type DeprecatedTwitchClient = TwitchClient;
/** @deprecated Use the named export `TwitchClient` instead. */
export default DeprecatedTwitchClient;
export { TwitchClient };

export { TwitchApiCallType, TwitchApiCallOptions } from './TwitchClient';
/** @deprecated Import `TwitchApiCallType` instead. */
export { TwitchApiCallType as TwitchAPICallType } from './TwitchClient';
/** @deprecated Import `TwitchApiCallOptions` instead. */
export { TwitchApiCallOptions as TwitchAPICallOptions } from './TwitchClient';

export { ConfigError } from './Errors/ConfigError';
export { HellFreezesOverError } from './Errors/HellFreezesOverError';
export { HttpStatusCodeError } from './Errors/HttpStatusCodeError';
/** @deprecated Import `HttpStatusCodeError` instead. */
export { HttpStatusCodeError as HTTPStatusCodeError } from './Errors/HttpStatusCodeError';
export { InvalidTokenError } from './Errors/InvalidTokenError';
export { InvalidTokenTypeError } from './Errors/InvalidTokenTypeError';
export { NoSubscriptionProgramError } from './Errors/NoSubscriptionProgramError';
export { StreamNotLiveError } from './Errors/StreamNotLiveError';

export { AuthProvider, AuthProviderTokenType } from './Auth/AuthProvider';
export { StaticAuthProvider } from './Auth/StaticAuthProvider';
export { RefreshableAuthProvider } from './Auth/RefreshableAuthProvider';

export { AccessToken } from './API/AccessToken';
export { TokenInfo } from './API/TokenInfo';

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
export { CommercialLength } from './API/Kraken/Channel/ChannelApi';

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

export { HelixExtensionTransaction } from './API/Helix/Extensions/HelixExtensionTransaction';

export { HelixGame } from './API/Helix/Game/HelixGame';

export { HelixBan } from './API/Helix/Moderation/HelixBan';
export { HelixBanEvent } from './API/Helix/Moderation/HelixBanEvent';
export { HelixModerator } from './API/Helix/Moderation/HelixModerator';
export { HelixModeratorEvent } from './API/Helix/Moderation/HelixModeratorEvent';

export { HelixSubscription } from './API/Helix/Subscriptions/HelixSubscription';
export { HelixSubscriptionEvent } from './API/Helix/Subscriptions/HelixSubscriptionEvent';

export { HelixStream, HelixStreamType } from './API/Helix/Stream/HelixStream';

export { HelixFollow } from './API/Helix/User/HelixFollow';
export { HelixPrivilegedUser } from './API/Helix/User/HelixPrivilegedUser';
export { HelixBroadcasterType, HelixUser, HelixUserType } from './API/Helix/User/HelixUser';

export { HelixVideo } from './API/Helix/Video/HelixVideo';

export { HelixWebHookHubRequestOptions } from './API/Helix/WebHooks/HelixWebHooksApi';

export { ChatBadgeList } from './API/Badges/ChatBadgeList';
export { ChatBadgeSet } from './API/Badges/ChatBadgeSet';
export { ChatBadgeScale, ChatBadgeVersion } from './API/Badges/ChatBadgeVersion';

export { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from './Toolkit/UserTools';
