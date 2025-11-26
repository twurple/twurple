import { rawDataSymbol, rtfm } from '@twurple/common';
import {
	type HelixExtensionType,
	type HelixUserExtensionData,
} from '../../../interfaces/endpoints/userExtension.external.js';
import { HelixBaseExtension } from './HelixBaseExtension.js';

/**
 * A Twitch Extension that was installed by a user.
 *
 * @inheritDoc
 */
@rtfm<HelixUserExtension>('api', 'HelixUserExtension', 'id')
export class HelixUserExtension extends HelixBaseExtension {
	/** @internal */ declare readonly [rawDataSymbol]: HelixUserExtensionData;

	/**
	 * Whether the user has configured the extension to be able to activate it.
	 */
	get canActivate(): boolean {
		return this[rawDataSymbol].can_activate;
	}

	/**
	 * The available types of the extension.
	 */
	get types(): HelixExtensionType[] {
		return this[rawDataSymbol].type;
	}
}
