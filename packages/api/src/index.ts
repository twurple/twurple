export { ApiClient } from './client/ApiClient';
export type { ApiConfig } from './client/ApiClient';

export type { BaseApi } from './api/BaseApi';

export { HelixPaginatedRequest } from './api/helix/HelixPaginatedRequest';
export { HelixPaginatedRequestWithTotal } from './api/helix/HelixPaginatedRequestWithTotal';
export type { HelixPaginatedResult, HelixPaginatedResultWithTotal } from './api/helix/HelixPaginatedResult';
export type { HelixForwardPagination, HelixPagination } from './api/helix/HelixPagination';

export { HelixBitsApi } from './api/helix/bits/HelixBitsApi';
export { HelixBitsLeaderboard } from './api/helix/bits/HelixBitsLeaderboard';
export { HelixBitsLeaderboardEntry } from './api/helix/bits/HelixBitsLeaderboardEntry';
export { HelixCheermoteList } from './api/helix/bits/HelixCheermoteList';
export { type HelixBitsLeaderboardQuery, type HelixBitsLeaderboardPeriod } from './interfaces/helix/bits.input';

export { HelixChannelApi } from './api/helix/channel/HelixChannelApi';
export { HelixChannel } from './api/helix/channel/HelixChannel';
export { HelixChannelEditor } from './api/helix/channel/HelixChannelEditor';
export { HelixChannelReference } from './api/helix/channel/HelixChannelReference';
export type { HelixChannelUpdate } from './interfaces/helix/channel.input';

export { HelixChannelPointsApi } from './api/helix/channelPoints/HelixChannelPointsApi';
export { HelixCustomReward } from './api/helix/channelPoints/HelixCustomReward';
export { HelixCustomRewardRedemption } from './api/helix/channelPoints/HelixCustomRewardRedemption';
export type {
	HelixCustomRewardRedemptionStatus,
	HelixCustomRewardRedemptionTargetStatus
} from './interfaces/helix/channelPoints.external';
export type {
	HelixPaginatedCustomRewardRedemptionFilter,
	HelixCustomRewardRedemptionFilter,
	HelixUpdateCustomRewardData,
	HelixCreateCustomRewardData
} from './interfaces/helix/channelPoints.input';

export { HelixCharityApi } from './api/helix/charity/HelixCharityApi';
export { HelixCharityCampaign } from './api/helix/charity/HelixCharityCampaign';
export { HelixCharityCampaignDonation } from './api/helix/charity/HelixCharityCampaignDonation';
export { HelixCharityCampaignAmount } from './api/helix/charity/HelixCharityCampaignAmount';

export { HelixChatApi } from './api/helix/chat/HelixChatApi';
export { HelixChatBadgeSet } from './api/helix/chat/HelixChatBadgeSet';
export { HelixChatBadgeVersion } from './api/helix/chat/HelixChatBadgeVersion';
export { HelixChatSettings } from './api/helix/chat/HelixChatSettings';
export { HelixChatChatter } from './api/helix/chat/HelixChatChatter';
export { HelixEmote } from './api/helix/chat/HelixEmote';
export { HelixChannelEmote } from './api/helix/chat/HelixChannelEmote';
export { HelixEmoteFromSet } from './api/helix/chat/HelixEmoteFromSet';
export { HelixPrivilegedChatSettings } from './api/helix/chat/HelixPrivilegedChatSettings';
export type {
	HelixChannelEmoteSubscriptionTier,
	HelixEmoteImageScale,
	HelixEmoteScale,
	HelixEmoteFormat,
	HelixEmoteThemeMode,
	HelixChatUserColor,
	HelixChatAnnouncementColor
} from './interfaces/helix/chat.external';
export type {
	HelixUpdateChatSettingsParams,
	HelixSendChatAnnouncementParams,
	HelixChatBadgeScale
} from './interfaces/helix/chat.input';

export { HelixClipApi } from './api/helix/clip/HelixClipApi';
export { HelixClip } from './api/helix/clip/HelixClip';
export type { HelixPaginatedClipFilter, HelixClipFilter, HelixClipCreateParams } from './interfaces/helix/clip.input';

export { HelixEntitlementApi } from './api/helix/entitlements/HelixEntitlementApi';
export { HelixDropsEntitlement } from './api/helix/entitlements/HelixDropsEntitlement';
export type {
	HelixDropsEntitlementFulfillmentStatus,
	HelixDropsEntitlementUpdateStatus
} from './interfaces/helix/entitlement.external';
export type {
	HelixDropsEntitlementFilter,
	HelixDropsEntitlementPaginatedFilter
} from './interfaces/helix/entitlement.input';

export { HelixEventSubApi } from './api/helix/eventSub/HelixEventSubApi';
export { HelixEventSubSubscription } from './api/helix/eventSub/HelixEventSubSubscription';
export { HelixPaginatedEventSubSubscriptionsRequest } from './api/helix/eventSub/HelixPaginatedEventSubSubscriptionsRequest';
export type { HelixEventSubTransportData, HelixEventSubSubscriptionStatus } from './interfaces/helix/eventSub.external';
export type {
	HelixEventSubTransportOptions,
	HelixEventSubWebSocketTransportOptions,
	HelixEventSubWebHookTransportOptions,
	HelixPaginatedEventSubSubscriptionsResult,
	HelixEventSubDropEntitlementGrantFilter
} from './interfaces/helix/eventSub.input';

export { HelixExtensionsApi } from './api/helix/extensions/HelixExtensionsApi';
export { HelixExtensionBitsProduct } from './api/helix/extensions/HelixExtensionBitsProduct';
export { HelixExtensionTransaction } from './api/helix/extensions/HelixExtensionTransaction';
export type {
	HelixExtensionBitsProductUpdatePayload,
	HelixExtensionTransactionsPaginatedFilter,
	HelixExtensionTransactionsFilter
} from './interfaces/helix/extensions.input';

export { HelixGameApi } from './api/helix/game/HelixGameApi';
export { HelixGame } from './api/helix/game/HelixGame';

export { HelixGoalApi } from './api/helix/goals/HelixGoalApi';
export { HelixGoal } from './api/helix/goals/HelixGoal';
export type { HelixGoalType } from './interfaces/helix/goal.external';

export { HelixHypeTrainApi } from './api/helix/hypeTrain/HelixHypeTrainApi';
export { HelixHypeTrainContribution } from './api/helix/hypeTrain/HelixHypeTrainContribution';
export { HelixHypeTrainEvent } from './api/helix/hypeTrain/HelixHypeTrainEvent';
export type { HelixHypeTrainContributionType, HelixHypeTrainEventType } from './interfaces/helix/hypeTrain.external';

export { HelixModerationApi } from './api/helix/moderation/HelixModerationApi';
export { HelixBan } from './api/helix/moderation/HelixBan';
export { HelixModerator } from './api/helix/moderation/HelixModerator';
export { HelixBanUser } from './api/helix/moderation/HelixBanUser';
export { HelixBlockedTerm } from './api/helix/moderation/HelixBlockedTerm';
export { HelixShieldModeStatus } from './api/helix/moderation/HelixShieldModeStatus';
export type { HelixBanFilter, HelixBanUserRequest, HelixModeratorFilter } from './interfaces/helix/moderation.input';

export { HelixPollApi } from './api/helix/poll/HelixPollApi';
export { HelixPoll } from './api/helix/poll/HelixPoll';
export { HelixPollChoice } from './api/helix/poll/HelixPollChoice';
export type { HelixPollStatus } from './interfaces/helix/poll.external';
export type { HelixCreatePollData } from './interfaces/helix/poll.input';

export { HelixPredictionApi } from './api/helix/prediction/HelixPredictionApi';
export { HelixPrediction } from './api/helix/prediction/HelixPrediction';
export { HelixPredictionOutcome } from './api/helix/prediction/HelixPredictionOutcome';
export { HelixPredictor } from './api/helix/prediction/HelixPredictor';
export type { HelixPredictionStatus, HelixPredictionOutcomeColor } from './interfaces/helix/prediction.external';
export type { HelixCreatePredictionData } from './interfaces/helix/prediction.input';

export { HelixRaidApi } from './api/helix/raids/HelixRaidApi';
export { HelixRaid } from './api/helix/raids/HelixRaid';

export { HelixUserRelation } from './api/helix/relations/HelixUserRelation';

export { HelixScheduleApi } from './api/helix/schedule/HelixScheduleApi';
export { HelixSchedule } from './api/helix/schedule/HelixSchedule';
export { HelixScheduleSegment } from './api/helix/schedule/HelixScheduleSegment';
export { HelixPaginatedScheduleSegmentRequest } from './api/helix/schedule/HelixPaginatedScheduleSegmentRequest';
export type {
	HelixUpdateScheduleSegmentData,
	HelixCreateScheduleSegmentData,
	HelixScheduleSettingsUpdate,
	HelixPaginatedScheduleFilter,
	HelixScheduleFilter
} from './interfaces/helix/schedule.input';

export { HelixSearchApi } from './api/helix/search/HelixSearchApi';
export { HelixChannelSearchResult } from './api/helix/search/HelixChannelSearchResult';
export type { HelixPaginatedChannelSearchFilter, HelixChannelSearchFilter } from './interfaces/helix/search.input';

export { HelixStreamApi } from './api/helix/stream/HelixStreamApi';
export { HelixStream } from './api/helix/stream/HelixStream';
export { HelixStreamMarker } from './api/helix/stream/HelixStreamMarker';
export { HelixStreamMarkerWithVideo } from './api/helix/stream/HelixStreamMarkerWithVideo';
export type { HelixStreamType } from './interfaces/helix/stream.external';
export type { HelixPaginatedStreamFilter, HelixStreamFilter } from './interfaces/helix/stream.input';

export { HelixSubscriptionApi } from './api/helix/subscriptions/HelixSubscriptionApi';
export { HelixSubscription } from './api/helix/subscriptions/HelixSubscription';
export { HelixUserSubscription } from './api/helix/subscriptions/HelixUserSubscription';
export type { HelixPaginatedSubscriptionsResult } from './interfaces/helix/subscription.input';

export { HelixTeamApi } from './api/helix/team/HelixTeamApi';
export { HelixTeam } from './api/helix/team/HelixTeam';
export { HelixTeamWithUsers } from './api/helix/team/HelixTeamWithUsers';

export { HelixUserApi } from './api/helix/user/HelixUserApi';
export { HelixUserBlock } from './api/helix/user/HelixUserBlock';
export { HelixFollow } from './api/helix/user/HelixFollow';
export { HelixPrivilegedUser } from './api/helix/user/HelixPrivilegedUser';
export { HelixUser } from './api/helix/user/HelixUser';
export type { HelixBroadcasterType } from './interfaces/helix/user.external';
export type {
	HelixPaginatedFollowFilter,
	HelixFollowFilter,
	HelixUserBlockAdditionalInfo,
	HelixUserUpdate
} from './interfaces/helix/user.input';

export { HelixBaseExtension } from './api/helix/user/Extensions/HelixBaseExtension';
export { HelixInstalledExtension } from './api/helix/user/Extensions/HelixInstalledExtension';
export { HelixInstalledExtensionList } from './api/helix/user/Extensions/HelixInstalledExtensionList';
export { HelixUserExtension } from './api/helix/user/Extensions/HelixUserExtension';
export type { HelixExtensionSlotType } from './interfaces/helix/userExtension.external';
export type {
	HelixUserExtensionUpdatePayload,
	HelixUserExtensionUpdatePayloadSlot,
	HelixUserExtensionUpdatePayloadActiveSlot,
	HelixUserExtensionUpdatePayloadInactiveSlot
} from './interfaces/helix/userExtension.input';

export { HelixVideoApi } from './api/helix/video/HelixVideoApi';
export { HelixVideo } from './api/helix/video/HelixVideo';
export type { HelixVideoType } from './interfaces/helix/video.external';
export type { HelixPaginatedVideoFilter, HelixVideoFilter } from './interfaces/helix/video.input';

export { HelixWhisperApi } from './api/helix/whisper/HelixWhisperApi';

export { ConfigError } from './errors/ConfigError';
export { StreamNotLiveError } from './errors/StreamNotLiveError';

export { ApiReportedRequest } from './reporting/ApiReportedRequest';

export type { HelixResponse, HelixPaginatedResponse, HelixPaginatedResponseWithTotal } from '@twurple/api-call';
export { ChatEmote, extractUserId, extractUserName, HelixExtension, HellFreezesOverError } from '@twurple/common';
export type {
	CheermoteBackground,
	CheermoteDisplayInfo,
	CommercialLength,
	CheermoteScale,
	CheermoteState,
	HelixExtensionSubscriptionsSupportLevel,
	HelixExtensionState,
	HelixExtensionIconSize,
	HelixExtensionConfigurationLocation,
	HelixUserType,
	UserIdResolvable,
	UserNameResolvable
} from '@twurple/common';
