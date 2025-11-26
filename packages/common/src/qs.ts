export function qsStringify(
	obj: Record<string, string | number | null | undefined | Array<string | number>> | undefined,
): string {
	if (!obj) {
		return '';
	}

	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(obj)) {
		if (value === null) {
			params.append(key, '');
		} else if (Array.isArray(value)) {
			for (const v of value) {
				params.append(key, v.toString());
			}
		} else if (value !== undefined) {
			params.append(key, value.toString());
		}
	}

	const result = params.toString();

	return result ? `?${result}` : '';
}
