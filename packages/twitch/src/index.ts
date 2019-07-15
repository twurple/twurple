import TwitchClient, { TwitchAPICallOptions, TwitchAPICallType } from './TwitchClient';

export default TwitchClient;
export { TwitchAPICallOptions, TwitchAPICallType };

import ConfigError from './Errors/ConfigError';
import HellFreezesOverError from './Errors/HellFreezesOverError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';
import NoSubscriptionProgramError from './Errors/NoSubscriptionProgramError';
import StreamNotLiveError from './Errors/StreamNotLiveError';

export { ConfigError, HellFreezesOverError, HTTPStatusCodeError, NoSubscriptionProgramError, StreamNotLiveError };

import AuthProvider from './Auth/AuthProvider';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import RefreshableAuthProvider from './Auth/RefreshableAuthProvider';

export { AuthProvider, StaticAuthProvider, RefreshableAuthProvider };

import AccessToken from './API/AccessToken';
import TokenInfo from './API/TokenInfo';

export { AccessToken, TokenInfo };

import Subscription from './API/Kraken/Subscription';

export { Subscription };

import CheermoteList, { CheermoteBackground, CheermoteState, CheermoteScale } from './API/Kraken/Bits/CheermoteList';

export { CheermoteList, CheermoteBackground, CheermoteState, CheermoteScale };

import Channel from './API/Kraken/Channel/Channel';
import ChannelFollow from './API/Kraken/Channel/ChannelFollow';
import ChannelPlaceholder from './API/Kraken/Channel/ChannelPlaceholder';
import ChannelSubscription from './API/Kraken/Channel/ChannelSubscription';
import EmoteSetList from './API/Kraken/Channel/EmoteSetList';
import PrivilegedChannel from './API/Kraken/Channel/PrivilegedChannel';

export { Channel, ChannelFollow, ChannelPlaceholder, ChannelSubscription, EmoteSetList, PrivilegedChannel };

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

import HelixGame from './API/Helix/Game/HelixGame';

export { HelixGame };

import HelixStream, { HelixStreamType } from './API/Helix/Stream/HelixStream';

export { HelixStream, HelixStreamType };

import HelixFollow from './API/Helix/User/HelixFollow';
import HelixPrivilegedUser from './API/Helix/User/HelixPrivilegedUser';
import HelixUser, { HelixBroadcasterType, HelixUserType } from './API/Helix/User/HelixUser';

export { HelixFollow, HelixPrivilegedUser, HelixUser, HelixBroadcasterType, HelixUserType };

import HelixVideo from './API/Helix/Video/HelixVideo';

export { HelixVideo };

import ChatBadgeList from './API/Badges/ChatBadgeList';
import ChatBadgeSet from './API/Badges/ChatBadgeSet';
import ChatBadgeVersion from './API/Badges/ChatBadgeVersion';

export { ChatBadgeList, ChatBadgeSet, ChatBadgeVersion };

import { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from './Toolkit/UserTools';

export { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable };
