const path = require('path');
const baseRules = require('@d-fischer/eslint-config');

const memberNames = [
	// Twitch API
	'_(id|name|at)$',
	'^((to_|from_)?broadcaster_|moderator_)?user_login$',
	'^(broadcaster|gifter|from|to)_login$',
	'^client_secret$',
	'^redirect_uri$',
	'^(access|refresh|auth|upload)_token$',
	'^has_(?:chat_support|delay)$',
	'^include_sponsored$',
	'^stream_(key|type)$',
	'^broadcaster_(language|type)$',
	'^(?:broadcast|grant|response|message|user|emote)_type$',
	'^force_verify$',
	'^expires_in$',
	'^badge_sets$',
	'^profile_banner(_background_color)?$',
	'^video_(?:banner|height|overlay)$',
	'^channel_feed_enabled$',
	'(?:^|_)(?:start|end)_time$',
	'^(?:(?:offline|profile|background)_image|edit|embed|thumbnail|box_art|click|viewer|icon|eula_tos|privacy_policy)_url$',
	'^click_action$',
	'^(image_)?url_\\dx$',
	'^emoticon_sets?$',
	'^is_(?:anonymous|broadcast|gift|user_input_required|sub_only|mature|enabled|paused|in_stock|previewable|playlist|(?:verified|known)_bot|live|auto|permanent|recurring|vacation_enabled|canceled|achieved|permitted)$',
	'^minimum_allowed_role$',
	'^(chatter|view(er)?)_count$',
	'^min_bits$',
	'^date_range$',
	'^event_(type|timestamp|data)$',
	'^product_(type|data)$',
	'^community_ids$',
	'^position_seconds$',
	'^(default|profile)_image$',
	'^(?:background|chat)_color$',
	'^max_per_(user_per_)?stream(_setting)?$',
	'^should_(?:redemptions_skip_request_queue|include_all)$',
	'^global_cooldown_(seconds|setting)$',
	'^redemptions_redeemed_current_stream$',
	'^only_manageable_rewards$',
	'^user_input$',
	'^hub.',
	'^email_verified$',
	'^twitter_connected$',
	'^chat_message$',
	'^badge_tier$',
	'^(?:previous|new|extension|format)_version$',
	'^(total_)?bits_used$',
	'^badge_entitlement$',
	'^moderation_action$',
	'^created_by$',
	'^sub_(plan|message)$',
	'^multi_month_duration$',
	'^sent_ts$',
	'^data_object$',
	'^average_fps$',
	'^description_html$',
	'^muted_segments$',
	'^tag_(ids|list)$',
	'^(last|top)_contributions?$',
	'^(streak|cumulative|duration)_months',
	'^live_only$',
	'^localization_(names|descriptions)',
	'^allow_notifications$',
	'^can_(?:cheer|activate|install|link_external_content)$',
	'^show_in_bits_card$',
	'^last_updated$',
	'^global_cooldown$',
	'^source_context$',
	'^(?:channel_points|bits|amount)_(?:votes|voting(?:_enabled)?|per_vote)$',
	'^prediction_window$',
	'^channel_points(?:_used|_won)?$',
	'^top_predictors$',
	'^content_classification$',
	'^reason_code$',
	'^resolver_login$',
	'^cumulative_total$',
	'^in_development$',
	'^canceled_until$',
	'^utc_offset$',
	'^target_height$',
	'^(?:allowlisted_(?:config|panel)|icon|screenshot)_urls$',
	'^bits_enabled$',
	'^configuration_location$',
	'^request_identity_link$',
	'^(?:subscriptions_support|overall)_level$',
	'^support_email$',
	'^viewer_summary$',
	'^aspect_(?:width|height|ratio_[xy])',
	'^(?:scale|zoom)_pixels',
	'^(?:current|target)_amount$',
	'^msg_text$',
	'^sexuality_sex_or_gender$',
	'^race_ethnicity_or_religion$',
	'^sex_based_terms$',
	'^required_configuration$',

	// HTTP
	'^Accept$'
];

const enumNames = [
	// Twitch API
	'x1_5'
];

const namingConvention = [...baseRules.rules['@typescript-eslint/naming-convention']].map(rule => {
	if (typeof rule === 'object') {
		if (rule.selector === 'default' && !rule.modifiers) {
			return {
				...rule,
				filter: {
					match: false,
					regex: [...memberNames, ...enumNames].join('|')
				}
			};
		}
		if (rule.selector === 'memberLike' && !rule.modifiers) {
			return {
				...rule,
				filter: {
					match: false,
					regex: [...memberNames, ...enumNames].join('|')
				}
			};
		}
		if (rule.selector === 'enumMember' && !rule.modifiers) {
			return {
				...rule,
				filter: {
					match: false,
					regex: enumNames.join('|')
				}
			};
		}
	}

	return rule;
});

module.exports = {
	extends: ['@d-fischer'],
	rules: {
		'@typescript-eslint/naming-convention': namingConvention
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-lerna': {
				packages: path.resolve(__dirname, 'packages')
			}
		}
	}
};
