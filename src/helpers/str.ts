export function nameToSlug(name: string) {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\-a-zA-Z0-9]+/g, ' ')
		.trim()
		.replace(/\ +/g, '-')
}

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.substring(1)
}
