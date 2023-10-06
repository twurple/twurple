import { parseChatMessage } from '../messagePartParser';

describe('Message part parser', () => {
	it('parses a message without emotes or cheers', () => {
		const message = 'very interesting message';

		expect(parseChatMessage(message, new Map())).toEqual([
			{
				type: 'text',
				text: message,
				position: 0,
				length: 24,
			},
		]);
	});

	it('parses a message with emotes', () => {
		const message = 'very interesting message Kappa truly great';
		const emoteOffsets = new Map([['25', ['25-29']]]);

		expect(parseChatMessage(message, emoteOffsets)).toEqual([
			{
				type: 'text',
				text: 'very interesting message ',
				position: 0,
				length: 25,
			},
			{
				type: 'emote',
				id: '25',
				name: 'Kappa',
				position: 25,
				length: 5,
			},
			{
				type: 'text',
				text: ' truly great',
				position: 30,
				length: 12,
			},
		]);
	});

	it('parses a message with emotes and cheermotes', () => {
		const message = 'Happy birthday bday100 PogChamp cheer1000';
		const emoteOffsets = new Map([['305954156', ['23-30']]]);
		const cheermoteNames = ['bday', 'cheer'];

		expect(parseChatMessage(message, emoteOffsets, cheermoteNames)).toEqual([
			{
				type: 'text',
				text: 'Happy birthday ',
				position: 0,
				length: 15,
			},
			{
				type: 'cheer',
				name: 'bday',
				amount: 100,
				position: 15,
				length: 7,
			},
			{
				type: 'text',
				text: ' ',
				position: 22,
				length: 1,
			},
			{
				type: 'emote',
				id: '305954156',
				name: 'PogChamp',
				position: 23,
				length: 8,
			},
			{
				type: 'text',
				text: ' ',
				position: 31,
				length: 1,
			},
			{
				type: 'cheer',
				name: 'cheer',
				amount: 1000,
				position: 32,
				length: 9,
			},
		]);
	});

	it('parses positions correctly after emoji', () => {
		const message = 'Happy birthday 🎉 🍰 bday100 PogChamp cheer1000';
		const emoteOffsets = new Map([['305954156', ['27-34']]]);
		const cheermoteNames = ['bday', 'cheer'];

		expect(parseChatMessage(message, emoteOffsets, cheermoteNames)).toEqual([
			{
				type: 'text',
				text: 'Happy birthday 🎉 🍰 ',
				position: 0,
				length: 19,
			},
			{
				type: 'cheer',
				name: 'bday',
				amount: 100,
				position: 19,
				length: 7,
			},
			{
				type: 'text',
				text: ' ',
				position: 26,
				length: 1,
			},
			{
				type: 'emote',
				id: '305954156',
				name: 'PogChamp',
				position: 27,
				length: 8,
			},
			{
				type: 'text',
				text: ' ',
				position: 35,
				length: 1,
			},
			{
				type: 'cheer',
				name: 'cheer',
				amount: 1000,
				position: 36,
				length: 9,
			},
		]);
	});
});
