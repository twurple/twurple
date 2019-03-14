/**
 * Information about a raid.
 */
export default interface ChatRitualInfo {
	/**
	 * The name of the ritual.
	 *
	 * Currently, the only known ritual is "new_chatter".
	 */
	ritualName: string;

	/**
	 * The message sent with the ritual.
	 *
	 * With the "new_chatter" ritual, you can choose between a set list of emotes to send.
	 */
	message: string;
}
