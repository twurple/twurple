import TwitchClient, { TwitchAPICallType } from './TwitchClient';

export default TwitchClient;
export { TwitchAPICallType };

import AuthorizationError from './Errors/AuthorizationError';
import ConfigError from './Errors/ConfigError';
import HellFreezesOverError from './Errors/HellFreezesOverError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';
import NoSubscriptionProgramError from './Errors/NoSubscriptionProgramError';
import StreamNotLiveError from './Errors/StreamNotLiveError';

export { AuthorizationError, ConfigError, HellFreezesOverError, HTTPStatusCodeError, NoSubscriptionProgramError, StreamNotLiveError };

import AuthProvider from './Auth/AuthProvider';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import RefreshableAuthProvider from './Auth/RefreshableAuthProvider';

export { AuthProvider, StaticAuthProvider, RefreshableAuthProvider };

import AccessToken from './API/AccessToken';
import Subscription from './API/Subscription';
import TokenInfo from './API/TokenInfo';

export { AccessToken, Subscription, TokenInfo };

import CheermoteList, { CheermoteBackground, CheermoteState, CheermoteScale } from './API/Bits/CheermoteList';

export { CheermoteList, CheermoteBackground, CheermoteState, CheermoteScale };

import Channel from './API/Channel/Channel';
import ChannelFollow from './API/Channel/ChannelFollow';
import ChannelPlaceholder from './API/Channel/ChannelPlaceholder';
import ChannelSubscription from './API/Channel/ChannelSubscription';
import EmoteSetList from './API/Channel/EmoteSetList';
import PrivilegedChannel from './API/Channel/PrivilegedChannel';

export { Channel, ChannelFollow, ChannelPlaceholder, ChannelSubscription, EmoteSetList, PrivilegedChannel };

import Stream, { StreamType } from './API/Stream/Stream';

export { Stream, StreamType };

import ChannelEvent from './API/Unsupported/ChannelEvent';
import ChattersList from './API/Unsupported/ChattersList';

export { ChannelEvent, ChattersList };

import PrivilegedUser from './API/User/PrivilegedUser';
import User from './API/User/User';
import UserBlock from './API/User/UserBlock';
import UserFollow from './API/User/UserFollow';
import UserSubscription from './API/User/UserSubscription';

export { PrivilegedUser, User, UserBlock, UserFollow, UserSubscription };

import HelixPaginatedRequest from './API/Helix/HelixPaginatedRequest';
import HelixResponse from './API/Helix/HelixResponse';

export { HelixPaginatedRequest, HelixResponse };

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
