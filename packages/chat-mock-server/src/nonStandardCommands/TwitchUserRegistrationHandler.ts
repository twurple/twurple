import { CommandHandler } from 'ircv3-server';
import { TwitchUserRegistration } from './TwitchUserRegistration';

export class TwitchUserRegistrationHandler extends CommandHandler<TwitchUserRegistration> {
	constructor() {
		super(TwitchUserRegistration);
		this._requiresRegistration = false;
	}

	handleCommand(): void {
		// literally just ignore it
	}
}
