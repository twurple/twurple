import { parseEmoteOffsets } from '../emoteUtil';

describe('Emote offset parser', () => {
	it('parses a single emote at a single place', () => {
		expect(parseEmoteOffsets('25:0-4')).toEqual(new Map([['25', ['0-4']]]));
	});

	it('parses a single emote multiple times', () => {
		expect(parseEmoteOffsets('25:0-4,6-10,12-16')).toEqual(new Map([['25', ['0-4', '6-10', '12-16']]]));
	});

	it('parses multiple emotes', () => {
		expect(parseEmoteOffsets('25:0-4/1902:6-10/305954156:12-19')).toEqual(
			new Map([
				['25', ['0-4']],
				['1902', ['6-10']],
				['305954156', ['12-19']],
			]),
		);
	});
});
