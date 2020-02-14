/* eslint-disable filenames/match-exported */
import TwitchClient, { TwitchAPICallType, TwitchAPICallOptions } from './TwitchClient';

export default TwitchClient;
export { TwitchAPICallType, TwitchAPICallOptions };

import ConfigError from './Errors/ConfigError';
import HellFreezesOverError from './Errors/HellFreezesOverError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';
import InvalidTokenError from './Errors/InvalidTokenError';
import NoSubscriptionProgramError from './Errors/NoSubscriptionProgramError';
import StreamNotLiveError from './Errors/StreamNotLiveError';

export {
	ConfigError,
	HellFreezesOverError,
	HTTPStatusCodeError,
	InvalidTokenError,
	NoSubscriptionProgramError,
	StreamNotLiveError
};

import AuthProvider from './Auth/AuthProvider';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import RefreshableAuthProvider from './Auth/RefreshableAuthProvider';

export { AuthProvider, StaticAuthProvider, RefreshableAuthProvider };

import AccessToken from './API/AccessToken';
import TokenInfo from './API/TokenInfo';

export { AccessToken, TokenInfo };

import Subscription from './API/Kraken/Subscription';

export { Subscription };

import CheermoteList, {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CheermoteScale,
	CheermoteState
} from './API/Kraken/Bits/CheermoteList';

export { CheermoteList, CheermoteBackground, CheermoteDisplayInfo, CheermoteScale, CheermoteState };

import Channel from './API/Kraken/Channel/Channel';
import ChannelFollow from './API/Kraken/Channel/ChannelFollow';
import ChannelPlaceholder from './API/Kraken/Channel/ChannelPlaceholder';
import ChannelSubscription from './API/Kraken/Channel/ChannelSubscription';
import EmoteSetList from './API/Kraken/Channel/EmoteSetList';
import PrivilegedChannel from './API/Kraken/Channel/PrivilegedChannel';
import { CommercialLength } from './API/Kraken/Channel/ChannelAPI';

export {
	Channel,
	ChannelFollow,
	ChannelPlaceholder,
	ChannelSubscription,
	EmoteSetList,
	PrivilegedChannel,
	CommercialLength
};

import Stream, { StreamType } from './API/Kraken/Stream/Stream';

export { Stream, StreamType };

import ChannelEvent from './API/Unsupported/ChannelEvent';
import ChattersList from './API/Unsupported/ChattersList';

export { ChannelEvent, ChattersList };

import PrivilegedUser from './API/Kraken/User/PrivilegedUser';
import User from './API/Kraken/User/User';
import UserBlock from './API/Kraken/User/UserBlock';
import UserFollow from './API/Kraken/User/UserFollow';
import UserSubscription from './API/Kraken/User/UserSubscription';

export { PrivilegedUser, User, UserBlock, UserFollow, UserSubscription };

import HelixPaginatedRequest from './API/Helix/HelixPaginatedRequest';
import HelixPaginatedResult, { HelixPaginatedResultWithTotal } from './API/Helix/HelixPaginatedResult';
import HelixResponse from './API/Helix/HelixResponse';

export { HelixPaginatedRequest, HelixPaginatedResult, HelixPaginatedResultWithTotal, HelixResponse };

import HelixBitsLeaderboard from './API/Helix/Bits/HelixBitsLeaderboard';
import HelixBitsLeaderboardEntry from './API/Helix/Bits/HelixBitsLeaderboardEntry';

export { HelixBitsLeaderboard, HelixBitsLeaderboardEntry };

import HelixClip from './API/Helix/Clip/HelixClip';

export { HelixClip };

import HelixExtensionTransaction from './API/Helix/Extensions/HelixExtensionTransaction';

export { HelixExtensionTransaction };

import HelixGame from './API/Helix/Game/HelixGame';

export { HelixGame };

import HelixBan from './API/Helix/Moderation/HelixBan';
import HelixBanEvent from './API/Helix/Moderation/HelixBanEvent';
import HelixModerator from './API/Helix/Moderation/HelixModerator';
import HelixModeratorEvent from './API/Helix/Moderation/HelixModeratorEvent';

export { HelixBan, HelixBanEvent, HelixModerator, HelixModeratorEvent };

import HelixStream, { HelixStreamType } from './API/Helix/Stream/HelixStream';

export { HelixStream, HelixStreamType };

import HelixFollow from './API/Helix/User/HelixFollow';
import HelixPrivilegedUser from './API/Helix/User/HelixPrivilegedUser';
import HelixUser, { HelixBroadcasterType, HelixUserType } from './API/Helix/User/HelixUser';

export { HelixFollow, HelixPrivilegedUser, HelixUser, HelixBroadcasterType, HelixUserType };

import HelixVideo from './API/Helix/Video/HelixVideo';

export { HelixVideo };

import HelixSubscription from './API/Helix/Subscriptions/HelixSubscription';
import HelixSubscriptionEvent from './API/Helix/Subscriptions/HelixSubscriptionEvent';

export { HelixSubscription, HelixSubscriptionEvent };

import ChatBadgeList from './API/Badges/ChatBadgeList';
import ChatBadgeSet from './API/Badges/ChatBadgeSet';
import ChatBadgeVersion, { ChatBadgeScale } from './API/Badges/ChatBadgeVersion';

export { ChatBadgeList, ChatBadgeSet, ChatBadgeVersion, ChatBadgeScale };

import { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from './Toolkit/UserTools';

export { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable };
