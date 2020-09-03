/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { ElectronAuthProvider } from './ElectronAuthProvider';
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
const DeprecatedElectronAuthProvider = deprecateClass(
	ElectronAuthProvider,
	'Use the named export `ElectronAuthProvider` instead.'
);
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
type DeprecatedElectronAuthProvider = ElectronAuthProvider;
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
export default DeprecatedElectronAuthProvider;
export { ElectronAuthProvider };

export { TwitchClientCredentials } from './ElectronAuthProvider';
export { ElectronAuthProviderOptions } from './ElectronAuthProviderOptions';
