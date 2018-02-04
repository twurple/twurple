/** @private */
export default class ArrayTools {
	static flatten<T>(arr: T[][]): T[] {
		return ([] as T[]).concat(...arr);
	}
}
