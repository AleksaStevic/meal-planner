import { Food } from '@prisma/client'
import boxen from 'boxen'
import chalk from 'chalk'
import { getBorderCharacters, table } from 'table'
import { format } from './output'

export function outputFood(food: Food) {
	const macrosTable = table(
		[
			['Slug:', food.id, '', ''],
			['Nutritivne vrednosti u 100g:', '', '', ''],
			[
				chalk.redBright('Calories'),
				chalk.blue('Carbs'),
				chalk.cyan('Fat'),
				chalk.yellow('Protein'),
			],
			[
				format(food.calories, 'kcal'),
				format(food.carbs, 'gram'),
				format(food.fat, 'gram'),
				format(food.protein, 'gram'),
			],
		],
		{
			border: getBorderCharacters('norc'),
			spanningCells: [
				{
					row: 0,
					col: 0,
					colSpan: 1,
				},
				{
					row: 0,
					col: 1,
					colSpan: 3,
				},
				{
					row: 1,
					col: 0,
					rowSpan: 1,
					colSpan: 4,
				},
			],
		}
	)

	console.log(
		boxen(macrosTable.trimEnd(), {
			title: chalk.white(food.name),
			titleAlignment: 'center',
			padding: 0.5,
		})
	)
}
