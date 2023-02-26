import { klona } from 'klona';

/** @private */
export const rawDataSymbol: unique symbol = Symbol('twurpleRawData');

/**
 * Gets the raw data of a data object.
 *
 * @param obj The data object to get the raw data of.
 */
export function getRawData<DataType>(obj: DataObject<DataType>): DataType {
	return klona(obj[rawDataSymbol]);
}

/** @private */
export abstract class DataObject<DataType> {
	/** @private */ readonly [rawDataSymbol]: DataType;

	/** @private */
	constructor(data: DataType) {
		this[rawDataSymbol] = data;
	}
}
