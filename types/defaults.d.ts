declare module 'defaults' {
	function defaults<T>(options: Partial<T>, defaultOptions: Partial<T>): T;
	namespace defaults {}
	export = defaults;
}
