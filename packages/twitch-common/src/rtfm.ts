import type { NoInfer } from '@d-fischer/shared-utils';

type PackageName =
	| 'twitch'
	| 'twitch-auth'
	| 'twitch-chat-client'
	| 'twitch-eventsub'
	| 'twitch-pubsub-client'
	| 'twitch-webhooks';

// Read The Fine Manual
export function rtfm(pkg: PackageName, name: string): ClassDecorator;
export function rtfm<T>(pkg: PackageName, name: string, idKey: keyof NoInfer<T>): ClassDecorator;
export function rtfm<T>(pkg: PackageName, name: string, idKey?: keyof NoInfer<T>): ClassDecorator {
	return clazz => {
		const fn = idKey
			? function (this: T) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					return `[${name}#${this[idKey]} - please check https://d-fischer.github.io/${pkg}/reference/classes/${name}.html for available properties]`;
			  }
			: function () {
					return `[${name} - please check https://d-fischer.github.io/${pkg}/reference/classes/${name}.html for available properties]`;
			  };
		Object.defineProperty(clazz.prototype, Symbol.for('nodejs.util.inspect.custom'), {
			value: fn,
			enumerable: false
		});
	};
}
