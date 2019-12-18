/** @private */
export interface HelixExtensionProductCostData {
	amount: number;
	type: string; // TODO string union?
}

/** @private */
export default interface HelixExtensionProductData {
	sku: string;
	cost: HelixExtensionProductCostData;
	displayName: string;
	inDevelopment: boolean;
}
