/**
 * The location of an extension's configuration.
 */
export type HelixExtensionConfigurationLocation = 'hosted' | 'custom' | 'none';
/**
 * The support level of subscriptions in an extension.
 */
export type HelixExtensionSubscriptionsSupportLevel = 'optional' | 'none';
/**
 * The size of an extension icon.
 */
export type HelixExtensionIconSize = '100x100' | '24x24' | '300x200';
/**
 * The state of an extension.
 */
export type HelixExtensionState =
	| 'InTest'
	| 'InReview'
	| 'Rejected'
	| 'Approved'
	| 'Released'
	| 'Deprecated'
	| 'PendingAction'
	| 'AssetsUploaded'
	| 'Deleted';

/** @private */
interface HelixExtensionMobileViewData {
	viewer_url: string;
}

/** @private */
interface HelixExtensionPanelViewData {
	viewer_url: string;
	height: number;
	can_link_external_content: boolean;
}

/** @private */
interface HelixExtensionOverlayViewData {
	viewer_url: string;
	can_link_external_content: boolean;
}

/** @private */
interface HelixExtensionComponentViewData {
	viewer_url: string;
	aspect_width: number;
	aspect_height: number;
	aspect_ratio_x: number;
	aspect_ratio_y: number;
	autoscale: boolean;
	scale_pixels: number;
	target_height: number;
	size: number;
	zoom: boolean;
	zoom_pixels: number;
	can_link_external_content: boolean;
}

/** @private */
interface HelixExtensionConfigViewData {
	viewer_url: string;
	can_link_external_content: boolean;
}

/** @private */
interface HelixExtensionViewsData {
	mobile?: HelixExtensionMobileViewData;
	panel?: HelixExtensionPanelViewData;
	video_overlay?: HelixExtensionOverlayViewData;
	component?: HelixExtensionComponentViewData;
	config?: HelixExtensionConfigViewData;
}

/** @private */
export interface HelixExtensionData {
	author_name: string;
	bits_enabled: boolean;
	can_install: boolean;
	configuration_location: HelixExtensionConfigurationLocation;
	description: string;
	eula_tos_url: string;
	has_chat_support: boolean;
	icon_url: string;
	icon_urls: Record<HelixExtensionIconSize, string>;
	id: string;
	name: string;
	privacy_policy_url: string;
	request_identity_link: boolean;
	screenshot_urls: string[];
	state: HelixExtensionState;
	subscriptions_support_level: HelixExtensionSubscriptionsSupportLevel;
	summary: string;
	support_email: string;
	version: string;
	viewer_summary: string;
	views: HelixExtensionViewsData;
	allowlisted_config_urls: string[];
	allowlisted_panel_urls: string[];
}
