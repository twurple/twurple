/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'trouter' {
	interface Match {
		params: Record<string, any>;
		handlers: any[];
	}

	namespace Trouter {}

	class Trouter {
		/**
		 * @class Initializes a new Trouter instance. Currently accepts no options.
		 */
		constructor(opts?: {});

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		acl(pattern: string, handler: any): this;

		/**
		 * @param method Any valid HTTP method name.
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		add(method: string, pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		all(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		bind(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		checkout(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		connect(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		copy(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		delete(pattern: string, handler: any): this;

		/**
		 * @param method Any valid HTTP method name.
		 * @param url The URL used to match against pattern definitions. This is typically req.url.
		 * @returns This method will return false if no match is found. Otherwise it returns an Object with params and handler keys.
		 */
		find(method: string, url: string): Match | boolean;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		get(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		head(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		link(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		lock(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		['m-search'](pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		merge(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		mkactivity(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		mkcalendar(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		mkcol(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		move(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		notify(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		options(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		patch(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		post(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		propfind(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		proppatch(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		purge(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		put(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		rebind(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		report(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		search(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		subscribe(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		trace(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		unbind(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		unlink(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		unlock(pattern: string, handler: any): this;

		/**
		 * @param pattern The routing pattern to match on.
		 * @param handler The function(s) that should be tied to this pattern.
		 */
		unsubscribe(pattern: string, handler: any): this;
	}

	export = Trouter;
}
