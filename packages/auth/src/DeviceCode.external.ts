/** @internal */
export interface DeviceCodeData {
	device_code: string;
	user_code: string;
	verification_uri: string;
	expires_in: number;
	interval: number;
}
