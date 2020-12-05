/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { ElectronAuthProvider } from './ElectronAuthProvider';
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
const DeprecatedElectronAuthProvider = deprecateClass(
	ElectronAuthProvider,
	`[twitch-electron-auth-provider] The default export has been deprecated. Use the named export instead:

\timport { ElectronAuthProvider } from 'twitch-electron-auth-provider';`
);
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
// eslint-disable-next-line @typescript-eslint/no-redeclare
type DeprecatedElectronAuthProvider = ElectronAuthProvider;
/** @deprecated Use the named export `ElectronAuthProvider` instead. */
export default DeprecatedElectronAuthProvider;
export { ElectronAuthProvider };

export type { TwitchClientCredentials } from './ElectronAuthProvider';
export type { ElectronAuthProviderOptions } from './ElectronAuthProviderOptions';
