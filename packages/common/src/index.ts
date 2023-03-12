export { DataObject, getRawData, rawDataSymbol } from './DataObject';

export { checkRelationAssertion } from './relations';

export { rtfm } from './rtfm';

export type { CommercialLength, HelixUserType } from './types';

export {
	BaseCheermoteList,
	type BasicMessageCheermote,
	type CheermoteScale,
	type CheermoteState,
	type CheermoteBackground,
	type CheermoteDisplayInfo,
	type CheermoteFormat,
	type MessageCheermote
} from './emotes/BaseCheermoteList';
export {
	ChatEmote,
	type EmoteSettings,
	type EmoteSize,
	type EmoteAnimationSettings,
	type EmoteBackgroundType
} from './emotes/ChatEmote';
export { ChatEmoteWithSet } from './emotes/ChatEmoteWithSet';
export {
	findCheermotePositions,
	fillTextPositions,
	parseChatMessage,
	parseEmotePositions
} from './emotes/messagePartParser';
export {
	type ParsedMessagePart,
	type ParsedMessageEmotePart,
	type ParsedMessageCheerPart,
	type ParsedMessageTextPart
} from './emotes/ParsedMessagePart';

export { HelixExtension } from './extensions/HelixExtension';
export type {
	HelixExtensionConfigurationLocation,
	HelixExtensionState,
	HelixExtensionIconSize,
	HelixExtensionSubscriptionsSupportLevel,
	HelixExtensionData
} from './extensions/HelixExtension.external';

export { CustomError } from './errors/CustomError';
export { HellFreezesOverError } from './errors/HellFreezesOverError';
export { RelationAssertionError } from './errors/RelationAssertionError';

export type {
	UserIdResolvable,
	UserIdResolvableType,
	UserNameResolvable,
	UserNameResolveableType
} from './userResolvers';
export { extractUserId, extractUserName } from './userResolvers';
