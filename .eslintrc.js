const path = require('path');
const baseRules = require('@d-fischer/eslint-config');

const memberNames = [
	// Twitch API
	'_(id|name|at)$',
	'^user_login$',
	'^client_secret$',
	'^redirect_uri$',
	'^(access|refresh|auth|upload)_token$',
	'^has_delay$',
	'^include_sponsored$',
	'^stream_(key|type)$',
	'^broadcaster_(language|type)$',
	'^(broadcast|grant|response)_type$',
	'^force_verify$',
	'^expires_in$',
	'^badge_sets$',
	'^profile_banner(_background_color)?$',
	'^video_banner$',
	'^channel_feed_enabled$',
	'^(start|end)_time$',
	'^((offline|profile)_image|edit|embed|thumbnail|box_art|click)_url$',
	'^click_action$',
	'^(image_)?url_\\dx$',
	'^emoticon_sets?$',
	'^is_(anonymous|gift|user_input_required|sub_only|enabled|paused|in_stock|previewable|playlist|(verified|known)_bot)$',
	'^minimum_allowed_role$',
	'^(chatter|view(er)?)_count$',
	'^min_bits$',
	'^date_range$',
	'^event_(type|timestamp|data)$',
	'^product_(type|data)$',
	'^community_ids$',
	'^position_seconds$',
	'^(default|profile)_image$',
	'^background_color$',
	'^max_per_stream$',
	'^should_redemptions_skip_request_queue$',
	'^user_input$',
	'^hub.',
	'^email_verified$',
	'^twitter_connected$',
	'^chat_message$',
	'^badge_tier$',
	'^message_type$',
	'^(previous|new)_version$',
	'^(total_)?bits_used$',
	'^badge_entitlement$',
	'^moderation_action$',
	'^created_by$',
	'^sub_(plan|message)$',
	'^multi_month_duration$',
	'^user_type$',
	'^sent_ts$',
	'^data_object$',
	'^video_height$',
	'^average_fps$',
	'^description_html$',
	'^muted_segments$',
	'^tag_list$',
	'^cooldown_end_time$',
	'^(last|top)_contributions?$',
	'^(streak|cumulative)_months',
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
