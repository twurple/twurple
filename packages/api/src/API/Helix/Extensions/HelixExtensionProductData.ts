/** @private */
export interface HelixExtensionProductCostData {
	amount: number;
	type: 'bits';
}

/** @private */
export interface HelixExtensionProductData {
	sku: string;
	cost: HelixExtensionProductCostData;
	displayName: string;
	inDevelopment: boolean;
}
