import { Spinner } from '@topcli/spinner'
import chalk from 'chalk'

export function macrosOutput(
	calories: number,
	carbs: number,
	fat: number,
	protein: number
) {
	return [
		`${chalk.redBright('Calories')}: ${format(calories, 'kcal')}`,
		`${chalk.blue('Carbs')}: ${format(carbs, 'gram')}`,
		`${chalk.cyan('Fat')}: ${format(fat, 'gram')}`,
		`${chalk.yellow('Protein')}: ${format(protein, 'gram')}`,
	]
}

export const circleHalvesSpinner = new Spinner({
	name: 'circleHalves',
})

const genericFormat = new Intl.NumberFormat('sr-RS', {
	style: 'decimal',
	maximumFractionDigits: 2,
	useGrouping: false,
})

const massFormat = new Intl.NumberFormat('sr-RS', {
	style: 'unit',
	unit: 'gram',
	maximumFractionDigits: 2,
})

const currencyFormat = new Intl.NumberFormat('sr-RS', {
	style: 'currency',
	currency: 'RSD',
})

type Unit = 'gram' | 'currency' | (string & {})

export function format(num: number, unit: Unit) {
	const str = (() => {
		switch (unit) {
			case 'gram':
				return massFormat.format(num)
			case 'currency':
				return currencyFormat.format(num)
			default:
				return genericFormat.format(num) + ' ' + unit
		}
	})()

	return chalk.bold(str)
}
