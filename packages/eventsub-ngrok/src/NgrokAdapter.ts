import { Enumerable } from '@d-fischer/shared-utils';
import { connect } from '@ngrok/ngrok';
import { ConnectionAdapter } from '@twurple/eventsub-http';

/**
 * The configuration of the ngrok adapter.
 */
export interface NgrokAdapterConfig {
	/**
	 * The port to listen on. Defaults to 8000.
	 */
	port?: number;
	authtoken?: string;
	authtoken_from_env?: boolean;
}

/**
 * A connection adapter that uses ngrok to make local testing easy.
 */
export class NgrokAdapter extends ConnectionAdapter {
	/** @internal */ @Enumerable(false) private readonly _listenerPort: number;
	/** @internal */ @Enumerable(false) private readonly _authtoken: string | undefined;
	/** @internal */ @Enumerable(false) private readonly _authtoken_from_env: boolean;
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
		this._authtoken = config.authtoken;
		this._authtoken_from_env = config.authtoken_from_env ?? false;
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
		this._hostNamePromise ??= connect({ addr: this._listenerPort, authtoken: this._authtoken ,authtoken_from_env: this._authtoken_from_env }).then(url =>
			url.replace(/^https?:\/\/|\/$/g, ''),
		);

		return await this._hostNamePromise;
	}
}
