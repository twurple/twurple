/**
 * Data to create a new prediction.
 */
export interface HelixCreatePredictionData {
	/**
	 * The title of the prediction.
	 */
	title: string;

	/**
	 * The possible outcomes for the prediction.
	 */
	outcomes: string[];

	/**
	 * The time after which the prediction will be automatically locked, in seconds from creation.
	 */
	autoLockAfter: number;
}
