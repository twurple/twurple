export { ApiClient } from './client/ApiClient';
export type { ApiConfig } from './client/ApiClient';

export type { BaseApi } from './endpoints/BaseApi';

export { HelixBitsApi } from './endpoints/bits/HelixBitsApi';
export { HelixBitsLeaderboard } from './endpoints/bits/HelixBitsLeaderboard';
export { HelixBitsLeaderboardEntry } from './endpoints/bits/HelixBitsLeaderboardEntry';
export { HelixCheermoteList } from './endpoints/bits/HelixCheermoteList';
export { type HelixBitsLeaderboardQuery, type HelixBitsLeaderboardPeriod } from './interfaces/endpoints/bits.input';

export { HelixChannelApi } from './endpoints/channel/HelixChannelApi';
export { HelixChannel } from './endpoints/channel/HelixChannel';
export { HelixChannelEditor } from './endpoints/channel/HelixChannelEditor';
export { HelixChannelFollower } from './endpoints/channel/HelixChannelFollower';
export { HelixFollowedChannel } from './endpoints/channel/HelixFollowedChannel';
export { HelixChannelReference } from './endpoints/channel/HelixChannelReference';
export type { HelixChannelUpdate } from './interfaces/endpoints/channel.input';

export { HelixChannelPointsApi } from './endpoints/channelPoints/HelixChannelPointsApi';
export { HelixCustomReward } from './endpoints/channelPoints/HelixCustomReward';
export { HelixCustomRewardRedemption } from './endpoints/channelPoints/HelixCustomRewardRedemption';
export type {
	HelixCustomRewardRedemptionStatus,
	HelixCustomRewardRedemptionTargetStatus,
} from './interfaces/endpoints/channelPoints.external';
export type {
	HelixPaginatedCustomRewardRedemptionFilter,
	HelixCustomRewardRedemptionFilter,
	HelixUpdateCustomRewardData,
	HelixCreateCustomRewardData,
} from './interfaces/endpoints/channelPoints.input';

export { HelixCharityApi } from './endpoints/charity/HelixCharityApi';
export { HelixCharityCampaign } from './endpoints/charity/HelixCharityCampaign';
export { HelixCharityCampaignDonation } from './endpoints/charity/HelixCharityCampaignDonation';
export { HelixCharityCampaignAmount } from './endpoints/charity/HelixCharityCampaignAmount';

export { HelixChatApi } from './endpoints/chat/HelixChatApi';
export { HelixChatBadgeSet } from './endpoints/chat/HelixChatBadgeSet';
export { HelixChatBadgeVersion } from './endpoints/chat/HelixChatBadgeVersion';
export { HelixChatSettings } from './endpoints/chat/HelixChatSettings';
export { HelixChatChatter } from './endpoints/chat/HelixChatChatter';
export { HelixEmote } from './endpoints/chat/HelixEmote';
export { HelixChannelEmote } from './endpoints/chat/HelixChannelEmote';
export { HelixEmoteFromSet } from './endpoints/chat/HelixEmoteFromSet';
export { HelixPrivilegedChatSettings } from './endpoints/chat/HelixPrivilegedChatSettings';
export { HelixSentChatMessage } from './endpoints/chat/HelixSentChatMessage';
export type {
	HelixChannelEmoteSubscriptionTier,
	HelixEmoteImageScale,
	HelixEmoteScale,
	HelixEmoteFormat,
	HelixEmoteThemeMode,
	HelixChatUserColor,
	HelixChatAnnouncementColor,
} from './interfaces/endpoints/chat.external';
export type {
	HelixUpdateChatSettingsParams,
	HelixSendChatMessageParams,
	HelixSendChatAnnouncementParams,
	HelixChatBadgeScale,
} from './interfaces/endpoints/chat.input';

export { HelixClipApi } from './endpoints/clip/HelixClipApi';
export { HelixClip } from './endpoints/clip/HelixClip';
export type {
	HelixPaginatedClipFilter,
	HelixClipFilter,
	HelixClipCreateParams,
} from './interfaces/endpoints/clip.input';

export { HelixContentClassificationLabelApi } from './endpoints/contentClassificationLabels/HelixContentClassificationLabelApi';
export { HelixContentClassificationLabel } from './endpoints/contentClassificationLabels/HelixContentClassificationLabel';

export { HelixEntitlementApi } from './endpoints/entitlements/HelixEntitlementApi';
export { HelixDropsEntitlement } from './endpoints/entitlements/HelixDropsEntitlement';
export type {
	HelixDropsEntitlementFulfillmentStatus,
	HelixDropsEntitlementUpdateStatus,
} from './interfaces/endpoints/entitlement.external';
export type {
	HelixDropsEntitlementFilter,
	HelixDropsEntitlementPaginatedFilter,
} from './interfaces/endpoints/entitlement.input';

export { HelixEventSubApi } from './endpoints/eventSub/HelixEventSubApi';
export { HelixEventSubSubscription } from './endpoints/eventSub/HelixEventSubSubscription';
export { HelixPaginatedEventSubSubscriptionsRequest } from './endpoints/eventSub/HelixPaginatedEventSubSubscriptionsRequest';
export type {
	HelixEventSubTransportData,
	HelixEventSubSubscriptionStatus,
} from './interfaces/endpoints/eventSub.external';
export type {
	HelixEventSubTransportOptions,
	HelixEventSubWebSocketTransportOptions,
	HelixEventSubWebHookTransportOptions,
	HelixPaginatedEventSubSubscriptionsResult,
	HelixEventSubDropEntitlementGrantFilter,
} from './interfaces/endpoints/eventSub.input';

export { HelixExtensionsApi } from './endpoints/extensions/HelixExtensionsApi';
export { HelixExtensionBitsProduct } from './endpoints/extensions/HelixExtensionBitsProduct';
export { HelixExtensionTransaction } from './endpoints/extensions/HelixExtensionTransaction';
export type {
	HelixExtensionBitsProductUpdatePayload,
	HelixExtensionTransactionsPaginatedFilter,
	HelixExtensionTransactionsFilter,
} from './interfaces/endpoints/extensions.input';

export { HelixGameApi } from './endpoints/game/HelixGameApi';
export { HelixGame } from './endpoints/game/HelixGame';

export { HelixGoalApi } from './endpoints/goals/HelixGoalApi';
export { HelixGoal } from './endpoints/goals/HelixGoal';
export type { HelixGoalType } from './interfaces/endpoints/goal.external';

export { HelixHypeTrainApi } from './endpoints/hypeTrain/HelixHypeTrainApi';
export { HelixHypeTrainContribution } from './endpoints/hypeTrain/HelixHypeTrainContribution';
export { HelixHypeTrainEvent } from './endpoints/hypeTrain/HelixHypeTrainEvent';
export type {
	HelixHypeTrainContributionType,
	HelixHypeTrainEventType,
} from './interfaces/endpoints/hypeTrain.external';

export { HelixModerationApi } from './endpoints/moderation/HelixModerationApi';
export { HelixBan } from './endpoints/moderation/HelixBan';
export { HelixModerator } from './endpoints/moderation/HelixModerator';
export { HelixModeratedChannel } from './endpoints/moderation/HelixModeratedChannel';
export { HelixBanUser } from './endpoints/moderation/HelixBanUser';
export { HelixBlockedTerm } from './endpoints/moderation/HelixBlockedTerm';
export { HelixShieldModeStatus } from './endpoints/moderation/HelixShieldModeStatus';
export type {
	HelixBanFilter,
	HelixBanUserRequest,
	HelixModeratorFilter,
} from './interfaces/endpoints/moderation.input';

export { HelixPollApi } from './endpoints/poll/HelixPollApi';
export { HelixPoll } from './endpoints/poll/HelixPoll';
export { HelixPollChoice } from './endpoints/poll/HelixPollChoice';
export type { HelixPollStatus } from './interfaces/endpoints/poll.external';
export type { HelixCreatePollData } from './interfaces/endpoints/poll.input';

export { HelixPredictionApi } from './endpoints/prediction/HelixPredictionApi';
export { HelixPrediction } from './endpoints/prediction/HelixPrediction';
export { HelixPredictionOutcome } from './endpoints/prediction/HelixPredictionOutcome';
export { HelixPredictor } from './endpoints/prediction/HelixPredictor';
export type { HelixPredictionStatus, HelixPredictionOutcomeColor } from './interfaces/endpoints/prediction.external';
export type { HelixCreatePredictionData } from './interfaces/endpoints/prediction.input';

export { HelixRaidApi } from './endpoints/raids/HelixRaidApi';
export { HelixRaid } from './endpoints/raids/HelixRaid';

export { HelixUserRelation } from './relations/HelixUserRelation';

export { HelixScheduleApi } from './endpoints/schedule/HelixScheduleApi';
export { HelixSchedule } from './endpoints/schedule/HelixSchedule';
export { HelixScheduleSegment } from './endpoints/schedule/HelixScheduleSegment';
export { HelixPaginatedScheduleSegmentRequest } from './endpoints/schedule/HelixPaginatedScheduleSegmentRequest';
export type {
	HelixUpdateScheduleSegmentData,
	HelixCreateScheduleSegmentData,
	HelixScheduleSettingsUpdate,
	HelixPaginatedScheduleFilter,
	HelixScheduleFilter,
} from './interfaces/endpoints/schedule.input';

export { HelixSearchApi } from './endpoints/search/HelixSearchApi';
export { HelixChannelSearchResult } from './endpoints/search/HelixChannelSearchResult';
export type { HelixPaginatedChannelSearchFilter, HelixChannelSearchFilter } from './interfaces/endpoints/search.input';

export { HelixStreamApi } from './endpoints/stream/HelixStreamApi';
export { HelixStream } from './endpoints/stream/HelixStream';
export { HelixStreamMarker } from './endpoints/stream/HelixStreamMarker';
export { HelixStreamMarkerWithVideo } from './endpoints/stream/HelixStreamMarkerWithVideo';
export type { HelixStreamType } from './interfaces/endpoints/stream.external';
export type { HelixPaginatedStreamFilter, HelixStreamFilter } from './interfaces/endpoints/stream.input';

export { HelixPaginatedSubscriptionsRequest } from './endpoints/subscriptions/HelixPaginatedSubscriptionsRequest';
export { HelixSubscriptionApi } from './endpoints/subscriptions/HelixSubscriptionApi';
export { HelixSubscription } from './endpoints/subscriptions/HelixSubscription';
export { HelixUserSubscription } from './endpoints/subscriptions/HelixUserSubscription';
export type { HelixPaginatedSubscriptionsResult } from './interfaces/endpoints/subscription.input';

export { HelixTeamApi } from './endpoints/team/HelixTeamApi';
export { HelixTeam } from './endpoints/team/HelixTeam';
export { HelixTeamWithUsers } from './endpoints/team/HelixTeamWithUsers';

export { HelixUserApi } from './endpoints/user/HelixUserApi';
export { HelixUserBlock } from './endpoints/user/HelixUserBlock';
export { HelixFollow } from './endpoints/user/HelixFollow';
export { HelixPrivilegedUser } from './endpoints/user/HelixPrivilegedUser';
export { HelixUser } from './endpoints/user/HelixUser';
export type { HelixBroadcasterType } from './interfaces/endpoints/user.external';
export type { HelixUserBlockAdditionalInfo, HelixUserUpdate } from './interfaces/endpoints/user.input';

export { HelixBaseExtension } from './endpoints/user/extensions/HelixBaseExtension';
export { HelixInstalledExtension } from './endpoints/user/extensions/HelixInstalledExtension';
export { HelixInstalledExtensionList } from './endpoints/user/extensions/HelixInstalledExtensionList';
export { HelixUserExtension } from './endpoints/user/extensions/HelixUserExtension';
export type { HelixExtensionSlotType } from './interfaces/endpoints/userExtension.external';
export type {
	HelixUserExtensionUpdatePayload,
	HelixUserExtensionUpdatePayloadSlot,
	HelixUserExtensionUpdatePayloadActiveSlot,
	HelixUserExtensionUpdatePayloadInactiveSlot,
} from './interfaces/endpoints/userExtension.input';

export { HelixVideoApi } from './endpoints/video/HelixVideoApi';
export { HelixVideo } from './endpoints/video/HelixVideo';
export type { HelixVideoType } from './interfaces/endpoints/video.external';
export type { HelixPaginatedVideoFilter, HelixVideoFilter } from './interfaces/endpoints/video.input';

export { HelixWhisperApi } from './endpoints/whisper/HelixWhisperApi';

export { ConfigError } from './errors/ConfigError';
export { StreamNotLiveError } from './errors/StreamNotLiveError';

export { ApiReportedRequest } from './reporting/ApiReportedRequest';

export { HelixPaginatedRequest } from './utils/pagination/HelixPaginatedRequest';
export { HelixPaginatedRequestWithTotal } from './utils/pagination/HelixPaginatedRequestWithTotal';
export type { HelixPaginatedResult, HelixPaginatedResultWithTotal } from './utils/pagination/HelixPaginatedResult';
export type { HelixForwardPagination, HelixPagination } from './utils/pagination/HelixPagination';

export type { HelixResponse, HelixPaginatedResponse, HelixPaginatedResponseWithTotal } from '@twurple/api-call';
export { extractUserId, extractUserName, HelixExtension, HellFreezesOverError } from '@twurple/common';
export type {
	CommercialLength,
	HelixExtensionSubscriptionsSupportLevel,
	HelixExtensionState,
	HelixExtensionIconSize,
	HelixExtensionConfigurationLocation,
	HelixUserType,
	UserIdResolvable,
	UserNameResolvable,
} from '@twurple/common';
