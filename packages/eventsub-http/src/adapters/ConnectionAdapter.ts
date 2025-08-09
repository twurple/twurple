import {type Server, serve} from 'srvx';
import { type H3 } from 'h3';

/**
 * An abstraction of a WebHook connection adapter.
 */
export abstract class ConnectionAdapter {
	/**
	 * Creates the HTTP server to use for listening to events.
	 *
	 * @param app
	 * @param port
	 * @protected
	 */
	createHttpServer(app: H3, port: number): Server {
		return serve({
			fetch: app.fetch,
			port,
		})
	}

	/**
	 * Whether the connection adapter listens using SSL.
	 *
	 * @protected
	 */
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	get listenUsingSsl(): boolean {
		return false;
	}

	/**
	 * The port the HTTP server should listen on.
	 *
	 * If not given, the listener will default to use port 443.
	 *
	 * @protected
	 */
	get listenerPort(): number | undefined {
		return undefined;
	}

	/**
	 * Returns the host name that should be used by Twitch to connect to this server.
	 *
	 * @protected
	 */
	abstract getHostName(): Promise<string>;

	/**
	 * The path prefix an external connection needs to reach this server.
	 *
	 * @protected
	 */
	get pathPrefix(): string | undefined {
		return undefined;
	}

	/**
	 * Whether the path prefix is passed to the handler.
	 *
	 * Defaults to `false` which means that the layer redirecting to this server needs to strip the path prefix in order for it to work.
	 *
	 * For example, if the path prefix is set to /hooks, an external connection to /hooks/abc should pass /abc as the path to this server.
	 *
	 * Conversely, if this is set to `true`, the path should be passed as is (i.e. /hooks/abc).
	 *
	 * @protected
	 */
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	get usePathPrefixInHandlers(): boolean {
		return false;
	}
}
