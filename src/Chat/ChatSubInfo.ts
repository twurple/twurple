export default interface ChatSubInfo {
	displayName: string;
	plan: string;
	planName: string;
	isPrime: boolean;
	streak: number;
	message?: string;
}

export interface ChatSubGiftInfo extends ChatSubInfo {
	gifter: string;
	gifterDisplayName: string;
}
