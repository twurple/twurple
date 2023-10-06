import { splitOnSpaces } from '../messageUtil';

describe('Auto Text Splitter with Spaces', () => {
	const testString = 'This is a test ';
	const testStringNoSpaces = 'Thisisatest';

	const realUseCase =
		'channel : (es) hola, este es un caso de uso real de alguien que escribe un mensaje realmente largo y,' +
		' como resultado, tiene que dividirse en muchos mensajes | (pt) olá, este é um caso de uso real de alguém digitando uma mensagem ' +
		"muito longa e tendo que ser dividida em muitas mensagens como resultado | (fr) bonjour c'est un vrai cas d'utilisation de " +
		"quelqu'un qui tape un très long message et qui doit être divisé en plusieurs messages en conséquence " +
		'| (ru) привет, это реальный случай, когда кто-то набирает очень длинное сообщение, и в результате его приходится разбивать на множество сообщений.';

	const stringFromRightToLeft =
		'.مرحبًا ، هذه رسالة طويلة حقًا مكتوبة باللغة العربية وأردت اختبار ما إذا كانت ستنجح بحيث يكون كل شيء منطقيًا وإلا فلن يصلح على الإطلاق. هذا هو آخر شيء أريد أن أفعله. الشيء المهم هو أنها ميزة قوية ستساعد العديد من المطورين هناك. خاصة أنه يقوم بالفصل على أساس المسافات بدلاً من مجرد الشخصيات التي أعتقد أنها أفضل بكثير.';

	const longStringFromRightToLeft =
		'مرحبًا ، هذه رسالة طويلة حقًا مكتوبة باللغة العربية وأردت اختبار ما إذا كانت ستنجح بحيث يكون كل شيء منطقيًا وإلا فلن يصلح على الإطلاق. هذا هو آخر شيء أريد أن أفعله. الشيء المهم هو أنها ميزة قوية ستساعد العديد من المطورين هناك. خاصة أنه يقوم بالفصل على أساس المسافات بدلاً من مجرد الشخصيات التي أعتقد أنها أفضل بكثير. مرحبًا ، هذه رسالة طويلة حقًا مكتوبة باللغة العربية وأردت اختبار ما إذا كانت ستنجح بحيث يكون كل شيء منطقيًا وإلا فلن يصلح على الإطلاق. هذا هو آخر شيء أريد أن أفعله الشيء المهم هو أنها ميزة قوية ستساعد العديد من المطورين هناك خاصة أنه يقوم بالفصل على أساس المسافات بدلاً من مجرد الشخصيات التي أعتقد أنها أفضل بكثير';

	test('Less than maxMsgLength chars should result in an array of length 1', () => {
		expect(splitOnSpaces('This is a test.', 500)).toStrictEqual(['This is a test.']);
	});

	test('With a command and less than maxMsgLength chars should result in an array of length 1', () => {
		expect(splitOnSpaces('/vip testChannel', 500)).toStrictEqual(['/vip testChannel']);
	});

	test('Character limit of 1', () => {
		expect(splitOnSpaces('/vip testChannel', 1)).toStrictEqual([
			'/',
			'v',
			'i',
			'p',
			't',
			'e',
			's',
			't',
			'C',
			'h',
			'a',
			'n',
			'n',
			'e',
			'l',
		]);
	});

	test('Over character limit and should have 2 messages', () => {
		expect(splitOnSpaces(testString.repeat(35), 500)).toStrictEqual([
			'This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This',
			'is a test This is a test',
		]);
	});

	test('Over character limit and should have 3 messages', () => {
		expect(splitOnSpaces(testString.repeat(70), 500)).toStrictEqual([
			'This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This',
			'is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a test This is a',
			'test This is a test This is a test This is a test',
		]);
	});

	test('Over character limit, has no spaces and should have 2 messages', () => {
		expect(splitOnSpaces(testStringNoSpaces.repeat(40), 250)).toStrictEqual([
			'ThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisat',
			'estThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatestThisisatest',
		]);
	});

	test('Real use case with 2 messages', () => {
		expect(splitOnSpaces(realUseCase, 500)).toStrictEqual([
			"channel : (es) hola, este es un caso de uso real de alguien que escribe un mensaje realmente largo y, como resultado, tiene que dividirse en muchos mensajes | (pt) olá, este é um caso de uso real de alguém digitando uma mensagem muito longa e tendo que ser dividida em muitas mensagens como resultado | (fr) bonjour c'est un vrai cas d'utilisation de quelqu'un qui tape un très long message et qui doit être divisé en plusieurs messages en conséquence | (ru) привет, это реальный случай, когда кто-то",
			'набирает очень длинное сообщение, и в результате его приходится разбивать на множество сообщений.',
		]);
	});

	test('In a language written from right to left and less than character limit', () => {
		expect(splitOnSpaces(stringFromRightToLeft, 500)).toStrictEqual([stringFromRightToLeft]);
	});

	test('In a language written from right to left and split into 2 messages', () => {
		expect(splitOnSpaces(longStringFromRightToLeft, 500)).toStrictEqual([
			'مرحبًا ، هذه رسالة طويلة حقًا مكتوبة باللغة العربية وأردت اختبار ما إذا كانت ستنجح بحيث يكون كل شيء منطقيًا وإلا فلن يصلح على الإطلاق. هذا هو آخر شيء أريد أن أفعله. الشيء المهم هو أنها ميزة قوية ستساعد العديد من المطورين هناك. خاصة أنه يقوم بالفصل على أساس المسافات بدلاً من مجرد الشخصيات التي أعتقد أنها أفضل بكثير. مرحبًا ، هذه رسالة طويلة حقًا مكتوبة باللغة العربية وأردت اختبار ما إذا كانت ستنجح بحيث يكون كل شيء منطقيًا وإلا فلن يصلح على الإطلاق. هذا هو آخر شيء أريد أن أفعله الشيء المهم هو أنها',
			'ميزة قوية ستساعد العديد من المطورين هناك خاصة أنه يقوم بالفصل على أساس المسافات بدلاً من مجرد الشخصيات التي أعتقد أنها أفضل بكثير',
		]);
	});
});
