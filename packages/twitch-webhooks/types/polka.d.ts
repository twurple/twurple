declare module 'polka' {
	import * as Router from 'trouter';
	import * as http from 'http';
	import * as https from 'https';
	import * as net from 'net';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

	interface PolkaOptions {
		server?: http.Server | https.Server;
		onError?: (err: string | Error, req: http.IncomingMessage, res: http.ServerResponse, next: Function) => void;
		onNoMatch?: (req: http.IncomingMessage, res: http.ServerResponse) => void;
	}

	namespace polka {
		type RequestHandler = (req: PolkaRequest, res: PolkaResponse, next: Function) => void;

		class Polka extends Router {
			readonly server: http.Server;

			constructor(opts: PolkaOptions);

			add(method: string, pattern: string, ...fns: RequestHandler[]): this;
			use(base: string, ...fns: RequestHandler[]): this;
			use(...fns: RequestHandler[]): this;

			// shamelessly stolen from @types/node's net.Server
			listen(port?: number, hostname?: string, backlog?: number, listeningListener?: Function): this;
			listen(port?: number, hostname?: string, listeningListener?: Function): this;
			listen(port?: number, backlog?: number, listeningListener?: Function): this;
			listen(port?: number, listeningListener?: Function): this;
			listen(path: string, backlog?: number, listeningListener?: Function): this;
			listen(path: string, listeningListener?: Function): this;
			listen(options: net.ListenOptions, listeningListener?: Function): this;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			listen(handle: any, backlog?: number, listeningListener?: Function): this;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			listen(handle: any, listeningListener?: Function): this;

			handler(req: http.IncomingMessage, res: http.ServerResponse, info: object): void;
		}

		interface PolkaRequest extends http.IncomingMessage {
			params: Record<string, string>;
			query: Record<string, string>;
		}

		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface PolkaResponse extends http.ServerResponse {}
	}
	function polka(options?: PolkaOptions): polka.Polka;

	export = polka;
}
