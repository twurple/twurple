export interface PubSubPingPacket {
	type: 'PING';
}

export interface PubSubPongPacket {
	type: 'PONG';
}

export interface PubSubReconnectPacket {
	type: 'RECONNECT';
}

export interface PubSubNoncedPacket {
	nonce?: string;
	type: string;
}

export interface PubSubListenPacket extends PubSubNoncedPacket {
	type: 'LISTEN';
	data: {
		topics: string[];
		auth_token?: string;
	};
}

export interface PubSubUnlistenPacket extends PubSubNoncedPacket {
	type: 'UNLISTEN';
	data: {
		topics: string[];
	};
}

export interface PubSubResponsePacket extends PubSubNoncedPacket {
	type: 'RESPONSE';
	error: string;
}

export interface PubSubMessagePacket {
	type: 'MESSAGE';
	data: {
		topic: string;
		message: string;
	};
}

export type PubSubIncomingPacket = PubSubPongPacket | PubSubReconnectPacket | PubSubResponsePacket | PubSubMessagePacket;
export type PubSubNoncedOutgoingPacket = PubSubListenPacket | PubSubUnlistenPacket;
export type PubSubOutgoingPacket = PubSubPingPacket | PubSubNoncedOutgoingPacket;
