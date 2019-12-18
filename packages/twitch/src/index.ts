/* eslint-disable filenames/match-exported */
import AccessToken from './API/AccessToken';
import ChatBadgeList from './API/Badges/ChatBadgeList';
import ChatBadgeSet from './API/Badges/ChatBadgeSet';
import ChatBadgeVersion, { ChatBadgeScale } from './API/Badges/ChatBadgeVersion';
import HelixBitsLeaderboard from './API/Helix/Bits/HelixBitsLeaderboard';
import HelixBitsLeaderboardEntry from './API/Helix/Bits/HelixBitsLeaderboardEntry';
import HelixClip from './API/Helix/Clip/HelixClip';
import HelixExtensionTransaction from './API/Helix/Extensions/HelixExtensionTransaction';
import HelixGame from './API/Helix/Game/HelixGame';
import HelixPaginatedRequest from './API/Helix/HelixPaginatedRequest';
import HelixPaginatedResult, { HelixPaginatedResultWithTotal } from './API/Helix/HelixPaginatedResult';
import HelixResponse from './API/Helix/HelixResponse';
import HelixStream, { HelixStreamType } from './API/Helix/Stream/HelixStream';
import HelixSubscription from './API/Helix/Subscriptions/HelixSubscription';
import HelixSubscriptionEvent from './API/Helix/Subscriptions/HelixSubscriptionEvent';
import HelixFollow from './API/Helix/User/HelixFollow';
import HelixPrivilegedUser from './API/Helix/User/HelixPrivilegedUser';
import HelixUser, { HelixBroadcasterType, HelixUserType } from './API/Helix/User/HelixUser';
import HelixVideo from './API/Helix/Video/HelixVideo';
import CheermoteList, {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CheermoteScale,
	CheermoteState
} from './API/Kraken/Bits/CheermoteList';
import Channel from './API/Kraken/Channel/Channel';
import { CommercialLength } from './API/Kraken/Channel/ChannelAPI';
import ChannelFollow from './API/Kraken/Channel/ChannelFollow';
import ChannelPlaceholder from './API/Kraken/Channel/ChannelPlaceholder';
import ChannelSubscription from './API/Kraken/Channel/ChannelSubscription';
import EmoteSetList from './API/Kraken/Channel/EmoteSetList';
import PrivilegedChannel from './API/Kraken/Channel/PrivilegedChannel';
import Stream, { StreamType } from './API/Kraken/Stream/Stream';
import Subscription from './API/Kraken/Subscription';
import PrivilegedUser from './API/Kraken/User/PrivilegedUser';
import User from './API/Kraken/User/User';
import UserBlock from './API/Kraken/User/UserBlock';
import UserFollow from './API/Kraken/User/UserFollow';
import UserSubscription from './API/Kraken/User/UserSubscription';
import TokenInfo from './API/TokenInfo';
import ChannelEvent from './API/Unsupported/ChannelEvent';
import ChattersList from './API/Unsupported/ChattersList';
import AuthProvider from './Auth/AuthProvider';
import RefreshableAuthProvider from './Auth/RefreshableAuthProvider';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import ConfigError from './Errors/ConfigError';
import HellFreezesOverError from './Errors/HellFreezesOverError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';
import InvalidTokenError from './Errors/InvalidTokenError';
import NoSubscriptionProgramError from './Errors/NoSubscriptionProgramError';
import StreamNotLiveError from './Errors/StreamNotLiveError';
import { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from './Toolkit/UserTools';
import TwitchClient, { TwitchAPICallOptions, TwitchAPICallType } from './TwitchClient';

export default TwitchClient;
export { TwitchAPICallType, TwitchAPICallOptions };

export {
	ConfigError,
	HellFreezesOverError,
	HTTPStatusCodeError,
	InvalidTokenError,
	NoSubscriptionProgramError,
	StreamNotLiveError
};

export { AuthProvider, StaticAuthProvider, RefreshableAuthProvider };

export { AccessToken, TokenInfo };

export { Subscription };

export { CheermoteList, CheermoteBackground, CheermoteDisplayInfo, CheermoteScale, CheermoteState };

export {
	Channel,
	ChannelFollow,
	ChannelPlaceholder,
	ChannelSubscription,
	EmoteSetList,
	PrivilegedChannel,
	CommercialLength
};

export { Stream, StreamType };

export { ChannelEvent, ChattersList };

export { PrivilegedUser, User, UserBlock, UserFollow, UserSubscription };

export { HelixPaginatedRequest, HelixPaginatedResult, HelixPaginatedResultWithTotal, HelixResponse };

export { HelixBitsLeaderboard, HelixBitsLeaderboardEntry };

export { HelixClip };

export { HelixExtensionTransaction };

export { HelixGame };

export { HelixStream, HelixStreamType };

export { HelixFollow, HelixPrivilegedUser, HelixUser, HelixBroadcasterType, HelixUserType };

export { HelixVideo };

export { HelixSubscription, HelixSubscriptionEvent };

export { ChatBadgeList, ChatBadgeSet, ChatBadgeVersion, ChatBadgeScale };

export { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable };
