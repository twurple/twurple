import { klona } from 'klona';

/** @private */
export const rawDataSymbol: unique symbol = Symbol('twurpleRawData');

/**
 * Retrieves the raw data of a data object.
 *
 * @param obj The data object to retrieve the raw data of.
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

	toJSON(): unknown {
		return JSON.parse(JSON.stringify(this[rawDataSymbol]));
	}
}
