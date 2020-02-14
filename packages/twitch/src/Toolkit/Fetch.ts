import * as fetchPonyfill from 'fetch-ponyfill';

const { fetch, Headers, Request, Response } = fetchPonyfill();

export { fetch, Headers, Request, Response };
