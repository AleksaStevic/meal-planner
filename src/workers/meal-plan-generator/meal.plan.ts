import { transpose } from '../../helpers/array'
import { chooseRepeating, rnd } from '../../helpers/combinatorics'
import { expDecaySkewedLeft, expDecaySkewedRight } from '../../helpers/math'
import { getBorderCharacters, table } from 'table'
import { RecipeData } from './types'
import chalk from 'chalk'

export class MealPlan {
	static readonly NumOfDays = 7
	static readonly MaxCalories = 1500
	static readonly MinProtein = 130

	public fitness: number
	constructor(public days: RecipeData[][]) {
		this.fitness = this.calcFitness()
	}

	static dayFitness(day: RecipeData[]) {
		const dayCalories = day.reduce((acc, r) => r.calories + acc, 0)
		const dayProtein = day.reduce((acc, r) => acc + r.protein, 0)

		const dayCaloriesRatio = dayCalories / MealPlan.MaxCalories
		const dayProteinRatio = dayProtein / MealPlan.MinProtein

		const cValue = expDecaySkewedRight(dayCaloriesRatio)
		const pValue = expDecaySkewedLeft(dayProteinRatio)

		// @TODO: refactor this to not use hardcoded weights
		return (pValue + cValue) * 100
	}

	calcFitness() {
		return this.days
			.map((day) => MealPlan.dayFitness(day))
			.reduce((acc, v) => acc + v, 0)
	}

	getPerDayValues() {
		return {
			days: this.days.map((day) => ({
				calories: day.reduce((acc, r) => r.calories + acc, 0),
				protein: day.reduce((acc, r) => acc + r.protein, 0),
				fitness: MealPlan.dayFitness(day),
			})),
			fitness: this.calcFitness(),
		}
	}

	output() {
		const t = table(
			[
				['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map(
					(v) => chalk.bold(v)
				),
				...transpose(this.days).map((row) =>
					row.map((v) => (v === null ? 'X' : v.name))
				),
			],
			{
				border: getBorderCharacters('norc'),
			}
		)

		console.log(t)
	}
}

export function randomMealPlan(pool: RecipeData[]) {
	const days: RecipeData[][] = []
	for (let i = 0; i < MealPlan.NumOfDays; ++i) {
		const numOfMeals = rnd.int(3, 6)
		days.push(chooseRepeating(pool, numOfMeals))
	}

	return new MealPlan(days)
}
