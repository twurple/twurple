import { IncomingMessage, ServerResponse } from 'http';

export type ConnectCompatibleMiddleware = (
	req: IncomingMessage,
	res: ServerResponse,
	next: (err?: unknown) => void
) => void;

export interface ConnectCompatibleApp {
	use(...middlewares: ConnectCompatibleMiddleware[]): unknown;
	use(path: string, ...middlewares: ConnectCompatibleMiddleware[]): unknown;
}
