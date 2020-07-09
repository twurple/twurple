/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { ElectronAuthProvider } from './ElectronAuthProvider';
/** @deprecated Please use the named export `ElectronAuthProvider` instead */
const DeprecatedElectronAuthProvider = deprecateClass(
	ElectronAuthProvider,
	'Please use the named export `ElectronAuthProvider` instead'
);
/** @deprecated Please use the named export `ElectronAuthProvider` instead */
type DeprecatedElectronAuthProvider = ElectronAuthProvider;
/** @deprecated Please use the named export `ElectronAuthProvider` instead */
export default DeprecatedElectronAuthProvider;
export { ElectronAuthProvider };

export { ElectronAuthProviderOptions } from './ElectronAuthProviderOptions';
