import chalk from 'chalk'
import { getBorderCharacters, table } from 'table'
import { transpose } from './array'
import { RecipeData } from 'workers/meal-plan-generator/types'

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

export function outputRecipeData(days: RecipeData[][]) {
	const t = table(
		[
			['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((v) =>
				chalk.bold(v)
			),
			...transpose(days).map((row) =>
				row.map((v) => (v === null ? 'X' : v.name))
			),
		],
		{
			border: getBorderCharacters('norc'),
		}
	)

	console.log(t)
}
