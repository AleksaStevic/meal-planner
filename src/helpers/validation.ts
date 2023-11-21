// @todo(aleksa): there is a bug here when entering something that is not text
export const positiveNumber = (input: number) => {
	if (isNaN(input)) return 'Should be a number.'
	if (input <= 0) return 'Should be greater than 0.'
	return true
}

export const nonnegativeNumber = (input: number) => {
	if (isNaN(input)) return 'Should be a number.'
	if (input < 0) return 'Should be nonnegative.'
	return true
}

export const slug = (input: string) => {
	if (/^[a-zA-z0-9]+(\-[a-zA-Z0-9]+)*$/.test(input)) return true

	return 'Should match /^[a-zA-z0-9]+(-[a-zA-Z0-9]+)*$/'
}

export const nonEmptyString = (input: string) => {
	if (input.length === 0) return 'Should not be empty.'

	return true
}
