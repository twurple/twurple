import type { NoInfer } from '@d-fischer/shared-utils';

type PackageName = 'api' | 'auth' | 'chat' | 'common' | 'eventsub' | 'pubsub' | 'webhooks';

// Read The Fine Manual
export function rtfm(pkg: PackageName, name: string): ClassDecorator;
export function rtfm<T>(pkg: PackageName, name: string, idKey: keyof NoInfer<T>): ClassDecorator;
export function rtfm<T>(pkg: PackageName, name: string, idKey?: keyof NoInfer<T>): ClassDecorator {
	return clazz => {
		const fn = idKey
			? function (this: T) {
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					return `[${name}#${this[idKey]} - please check https://twurple.github.io/reference/${pkg}/classes/${name}.html for available properties]`;
			  }
			: function () {
					return `[${name} - please check https://twurple.github.io/reference/${pkg}/classes/${name}.html for available properties]`;
			  };
		Object.defineProperty(clazz.prototype, Symbol.for('nodejs.util.inspect.custom'), {
			value: fn,
			enumerable: false
		});
	};
}
