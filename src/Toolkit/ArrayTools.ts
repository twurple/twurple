/** @private */
export default class ArrayTools {
	static flatten<T>(arr: T[][]) {
		return ([] as T[]).concat(...arr);
	}
}
