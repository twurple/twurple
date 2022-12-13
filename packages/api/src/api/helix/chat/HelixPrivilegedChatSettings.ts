import { rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixPrivilegedChatSettingsData } from '../../../interfaces/helix/chat.external';
import { HelixChatSettings } from './HelixChatSettings';

/**
 * The settings of a broadcaster's chat, with additional privileged data.
 */
@rtfm<HelixPrivilegedChatSettings>('api', 'HelixPrivilegedChatSettings', 'broadcasterId')
export class HelixPrivilegedChatSettings extends HelixChatSettings {
	/** @private */ declare readonly [rawDataSymbol]: HelixPrivilegedChatSettingsData;

	/**
	 * Whether non-moderator messages are delayed.
	 */
	get nonModeratorChatDelayEnabled(): boolean {
		return this[rawDataSymbol].non_moderator_chat_delay;
	}

	/**
	 * The delay of non-moderator messages, in seconds.
	 *
	 * Is `null` if non-moderator message delay is disabled.
	 */
	get nonModeratorChatDelay(): number | null {
		return this[rawDataSymbol].non_moderator_chat_delay_duration;
	}
}
