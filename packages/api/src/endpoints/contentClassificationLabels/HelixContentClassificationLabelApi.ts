import { type HelixResponse } from '@twurple/api-call';
import { rtfm } from '@twurple/common';
import { type HelixContentClassificationLabelData } from '../../interfaces/endpoints/contentClassificationLabels.external';
import { BaseApi } from '../BaseApi';
import { HelixContentClassificationLabel } from './HelixContentClassificationLabel';

/**
 * The Helix API methods that deal with content classification labels.
 *
 * Can be accessed using `client.contentClassificationLabels` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const labels = await api.contentClassificationLabels.getAll();
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Content classification labels
 */
@rtfm('api', 'HelixContentClassificationLabelApi')
export class HelixContentClassificationLabelApi extends BaseApi {
	/**
	 * Fetches a list of all content classification labels.
	 *
	 * @param locale The locale for the content classification labels.
	 */
	async getAll(locale?: string): Promise<HelixContentClassificationLabel[]> {
		const result = await this._client.callApi<HelixResponse<HelixContentClassificationLabelData>>({
			url: 'content_classification_labels',
			query: {
				locale,
			},
		});

		return result.data.map(data => new HelixContentClassificationLabel(data));
	}
}
