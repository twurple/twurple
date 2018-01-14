import BaseAPI from '../BaseAPI';
import { Cacheable, CachedGetter } from '../../Toolkit/Decorators';

import HelixStreamAPI from './Stream/HelixStreamAPI';
import HelixUserAPI from './User/HelixUserAPI';

@Cacheable
export default class HelixGroup extends BaseAPI {
	@CachedGetter()
	get streams() {
		return new HelixStreamAPI(this._client);
	}

	@CachedGetter()
	get users() {
		return new HelixUserAPI(this._client);
	}
}
