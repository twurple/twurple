import { RoomState } from '@twurple/chat';
import { randomUUID } from 'crypto';
import { type MessageTypes } from 'ircv3';
import {
	type Channel,
	type ChannelMetadata,
	HookResult,
	type MetadataHolder,
	type MetadataType,
	Module,
	type ModuleComponentHolder,
	type SendResponseCallback,
	type User
} from 'ircv3-server';

export class RoomStateModule extends Module {
	init(components: ModuleComponentHolder): void {
		components.addHook('afterChannelCreate', this.onAfterChannelCreate);
		components.addHook('afterChannelJoin', this.onAfterChannelJoin);
		components.addHook('metadataChange', this.onMetadataChange);
	}

	onAfterChannelCreate = (channel: Channel): HookResult => {
		channel.defaultMetadata({
			roomId: randomUUID(),
			emoteOnly: false,
			followersOnly: null,
			uniqueChat: false,
			slow: null,
			subsOnly: false
		});
		return HookResult.NEXT;
	};

	onAfterChannelJoin = (
		channel: Channel,
		user: User,
		cmd: MessageTypes.Commands.ChannelJoin,
		respond: SendResponseCallback
	): HookResult => {
		respond(
			RoomState,
			{ channel: channel.name },
			{ nick: 'tmi.twitch.tv' },
			{
				customTags: new Map<string, string>([
					['room-id', channel.getMetadata('roomId')],
					['emote-only', Number(channel.getMetadata('emoteOnly')).toString()],
					['followers-only', (channel.getMetadata('followersOnly') ?? -1).toString()],
					['r9k', Number(channel.getMetadata('uniqueChat')).toString()],
					['slow', (channel.getMetadata('slow') ?? 0).toString()],
					['subs-only', Number(channel.getMetadata('subsOnly')).toString()]
				])
			}
		);
		return HookResult.NEXT;
	};

	onMetadataChange = (
		type: MetadataType,
		holder: MetadataHolder<unknown>,
		key: string,
		value: unknown
	): HookResult => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (type !== 'channel') {
			return HookResult.NEXT;
		}

		const channel = holder as Channel;

		switch (key as keyof ChannelMetadata) {
			case 'emoteOnly': {
				this._announceRoomstateChange(channel, 'emote-only', Number(value));
				break;
			}
			case 'followersOnly': {
				this._announceRoomstateChange(channel, 'followers-only', (value as number | null) ?? -1);
				break;
			}
			case 'uniqueChat': {
				this._announceRoomstateChange(channel, 'r9k', Number(value));
				break;
			}
			case 'slow': {
				this._announceRoomstateChange(channel, 'slow', (value as number | null) ?? 0);
				break;
			}
			case 'subsOnly': {
				this._announceRoomstateChange(channel, 'subs-only', Number(value));
				break;
			}
			default: {
				break;
			}
		}

		return HookResult.NEXT;
	};

	private _announceRoomstateChange(channel: Channel, key: string, value: number) {
		channel.broadcastMessage(
			RoomState,
			{ channel: channel.name },
			{ nick: 'tmi.twitch.tv' },
			{
				customTags: new Map<string, string>([
					['room-id', channel.getMetadata('roomId')],
					[key, value.toString()]
				])
			}
		);
	}
}
