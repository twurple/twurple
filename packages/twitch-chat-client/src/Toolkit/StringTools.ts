export function utf8Substring(str: string, start: number, end?: number) {
	return [...str].slice(start, end).join('');
}

export function utf8Length(str: string) {
	return [...str].length;
}
