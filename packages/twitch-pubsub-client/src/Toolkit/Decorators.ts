// tslint:disable:only-arrow-functions

/** @private */
// tslint:disable-next-line:no-any
export function NonEnumerable(target: any, key: string) {
	// first property defined in prototype, that's why we use getters/setters
	// (otherwise assignment in object will override property in prototype)
	Object.defineProperty(target, key, {
		get: function () {
			return;
		},
		// tslint:disable-next-line:no-any
		set: function (this: any, val: any) {
			// here we have reference to instance and can set property directly to it
			Object.defineProperty(this, key, {
				value: val,
				writable: true,
				enumerable: false
			});
		},

		enumerable: false
	});
}
