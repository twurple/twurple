import { Enumerable } from '@d-fischer/shared-utils';
import { type Config as NgrokConfig, connect } from '@ngrok/ngrok';
import { ConnectionAdapter } from '@twurple/eventsub-http';

/**
 * The configuration of the ngrok adapter.
 */
export interface NgrokAdapterConfig {
	/**
	 * The port to listen on. Defaults to 8000.
	 */
	port?: number;

	/**
	 * Configuration options to pass to the ngrok client constructor.
	 *
	 * Note that the `addr` option is not supported.
	 */
	ngrokConfig?: Omit<NgrokConfig, 'addr'>;
}

/**
 * A connection adapter that uses ngrok to make local testing easy.
 */
export class NgrokAdapter extends ConnectionAdapter {
	/** @internal */ @Enumerable(false) private readonly _listenerPort: number;
	/** @internal */ @Enumerable(false) private readonly _ngrokConfig?: Omit<NgrokConfig, 'addr'>;

	/** @internal */ @Enumerable(false) private _hostNamePromise?: Promise<string>;

	/**
	 * Creates a new instance of the `NgrokAdapter`.
	 *
	 * @expandParams
	 *
	 * @param config
	 */
	constructor(config: NgrokAdapterConfig = {}) {
		super();
		this._listenerPort = config.port ?? 8000;
		this._ngrokConfig = config.ngrokConfig;
	}

	/** @protected */
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	get connectUsingSsl(): boolean {
		return true;
	}

	/** @protected */
	get listenerPort(): number {
		return this._listenerPort;
	}

	/** @protected */
	async getHostName(): Promise<string> {
		this._hostNamePromise ??= connect({ ...this._ngrokConfig, addr: this._listenerPort }).then(url =>
			url.replace(/^https?:\/\/|\/$/g, ''),
		);

		return await this._hostNamePromise;
	}
}
