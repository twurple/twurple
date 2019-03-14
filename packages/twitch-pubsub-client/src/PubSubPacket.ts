/** @private */
export interface PubSubPingPacket {
	type: 'PING';
}

/** @private */
export interface PubSubPongPacket {
	type: 'PONG';
}

/** @private */
export interface PubSubReconnectPacket {
	type: 'RECONNECT';
}

/** @private */
export interface PubSubNoncedPacket {
	nonce?: string;
	type: string;
}

/** @private */
export interface PubSubListenPacket extends PubSubNoncedPacket {
	type: 'LISTEN';
	data: {
		topics: string[];
		auth_token?: string;
	};
}

/** @private */
export interface PubSubUnlistenPacket extends PubSubNoncedPacket {
	type: 'UNLISTEN';
	data: {
		topics: string[];
	};
}

/** @private */
export interface PubSubResponsePacket extends PubSubNoncedPacket {
	type: 'RESPONSE';
	error: string;
}

/** @private */
export interface PubSubMessagePacket {
	type: 'MESSAGE';
	data: {
		topic: string;
		message: string;
	};
}

/** @private */
export type PubSubIncomingPacket = PubSubPongPacket | PubSubReconnectPacket | PubSubResponsePacket | PubSubMessagePacket;
/** @private */
export type PubSubNoncedOutgoingPacket = PubSubListenPacket | PubSubUnlistenPacket;
/** @private */
export type PubSubOutgoingPacket = PubSubPingPacket | PubSubNoncedOutgoingPacket;
