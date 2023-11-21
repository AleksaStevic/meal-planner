import chalk from 'chalk'
import { transpose } from './array'
import { format } from './output'
import { calcMacro } from './recipe'
import { capitalize } from './str'
import { Prisma } from '@prisma/client'
import { getBorderCharacters, table } from 'table'

const mealPlanWithRecipes = Prisma.validator<Prisma.MealPlanDefaultArgs>()({
	include: {
		days: {
			include: {
				recipes: {
					include: {
						recipe: {
							include: {
								ingredients: {
									include: {
										food: true,
										unit: true,
									},
								},
							},
						},
					},
				},
			},
		},
	},
})

type MealPlanWithRecipes = Prisma.MealPlanGetPayload<typeof mealPlanWithRecipes>

function macroRow(
	mealPlan: MealPlanWithRecipes,
	macro: 'calories' | 'carbs' | 'fat' | 'protein'
) {
	return [
		capitalize(macro),
		...mealPlan.days
			.sort((a, b) => a.order - b.order)
			.map((day) =>
				day.recipes.reduce(
					(sum, recipe) => calcMacro(recipe.recipe, macro) + sum,
					0
				)
			)
			.map((v) => format(v, macro === 'calories' ? 'kcal' : 'gram')),
	]
}

export function outputMealPlan(mealPlan: MealPlanWithRecipes) {
	const days = mealPlan.days
		.sort((a, b) => a.order - b.order)
		.map((day) => day.recipes.map((recipe) => recipe.recipe.name))

	const t = table(
		[
			[
				'Macros',
				'Day 1',
				'Day 2',
				'Day 3',
				'Day 4',
				'Day 5',
				'Day 6',
				'Day 7',
			].map((v) => chalk.bold(v)),
			...transpose(days).map((row) => {
				return [''].concat(row.map((cell) => (!cell ? 'X' : cell)))
			}),
			macroRow(mealPlan, 'calories'),
			macroRow(mealPlan, 'carbs'),
			macroRow(mealPlan, 'fat'),
			macroRow(mealPlan, 'protein'),
		],
		{
			border: getBorderCharacters('norc'),
		}
	)

	console.log(t)
}
