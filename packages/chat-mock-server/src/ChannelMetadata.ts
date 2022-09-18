declare module 'ircv3-server' {
	interface ChannelMetadata {
		roomId: string;
		emoteOnly: boolean;
		followersOnly: number | null;
		uniqueChat: boolean;
		slow: number | null;
		subsOnly: boolean;
	}
}

export {};
