import { Prisma } from '@prisma/client'
import boxen from 'boxen'
import chalk from 'chalk'
import { format } from './output'
import { table, getBorderCharacters } from 'table'
import { RecipeData } from 'workers/meal-plan-generator/types'

const recipeWithIngredients = Prisma.validator<Prisma.RecipeDefaultArgs>()({
	include: {
		ingredients: {
			include: {
				food: true,
				unit: true,
			},
		},
	},
})

type RecipeWithIngredients = Prisma.RecipeGetPayload<
	typeof recipeWithIngredients
>

export type Macros = 'calories' | 'carbs' | 'fat' | 'protein'

export function calcMacro(recipe: RecipeWithIngredients, macro: Macros) {
	return (
		recipe.ingredients.reduce(
			(acc, { food, unit, amount }) =>
				acc + (food[macro] * amount * (unit?.amount ?? 1)) / 100,
			0
		) / recipe.numServings
	)
}

export function outputRecipe(recipe: RecipeWithIngredients) {
	const ingredientTable = table(
		recipe.ingredients.map((i) => [
			i.food.name,
			format(i.amount, i.unitName ?? 'gram'),
		]),
		{
			border: getBorderCharacters('norc'),
			columns: [
				{
					width: 50,
				},
				{
					width: 12,
				},
			],
		}
	)

	const macrosTable = table(
		[
			[
				chalk.redBright('Calories'),
				chalk.blue('Carbs'),
				chalk.cyan('Fat'),
				chalk.yellow('Protein'),
			],
			[
				format(calcMacro(recipe, 'calories'), 'kcal'),
				format(calcMacro(recipe, 'carbs'), 'gram'),
				format(calcMacro(recipe, 'fat'), 'gram'),
				format(calcMacro(recipe, 'protein'), 'gram'),
			],
		],
		{
			border: getBorderCharacters('norc'),
			columnDefault: {
				width: 14,
			},
		}
	)

	console.log(
		boxen((ingredientTable + macrosTable).trimEnd(), {
			title: chalk.white(recipe.name),
			titleAlignment: 'center',
			padding: 0.5,
		})
	)
}

export function extractRecipeData(recipe: RecipeWithIngredients): RecipeData {
	return {
		id: recipe.id,
		name: recipe.name,
		calories: calcMacro(recipe, 'calories'),
		carbs: calcMacro(recipe, 'carbs'),
		fat: calcMacro(recipe, 'fat'),
		protein: calcMacro(recipe, 'protein'),
	}
}
