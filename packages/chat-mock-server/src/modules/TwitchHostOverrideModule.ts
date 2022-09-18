import { HookResult, Module, type ModuleComponentHolder, type User } from 'ircv3-server';

export class TwitchHostOverrideModule extends Module {
	init(components: ModuleComponentHolder): void {
		components.addHook('userRegister', this.onUserRegister);
	}

	onUserRegister = (user: User): HookResult => {
		user.overrideHostName = `${user.nick!}.tmi.twitch.tv`;
		return HookResult.NEXT;
	};
}
