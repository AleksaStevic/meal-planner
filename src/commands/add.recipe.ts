import { strict as assert } from 'node:assert/strict'
import { input, select } from '@inquirer/prompts'
import autocomplete from 'inquirer-autocomplete-standalone'
import chalk from 'chalk'
import Fuse from 'fuse.js'

// DB
import { prisma } from 'db/client'

// Helpers
import { numberPrompt, repeatedInput } from 'helpers/cli'
import { nonEmptyString, positiveNumber } from 'helpers/validation'
import { outputRecipe } from 'helpers/recipe'

export async function run() {
	const createdRecipes = await repeatedInput(async () => {
		const name = await input({
			message: 'Recipe name?',
			validate: nonEmptyString,
		})
		const numServings = await numberPrompt({
			message: 'Number of servings?',
		})
		console.log(chalk.white("Let's add ingredients:"))

		const allFoods = await prisma.food.findMany({})
		const fuse = new Fuse(allFoods, {
			keys: ['id', 'name'],
		})

		const ingredients = await repeatedInput(async () => {
			const id = await autocomplete({
				message: 'Ingredient ID?',
				source: (input: string | undefined) => {
					return Promise.resolve(
						fuse.search(input ?? '').map((result) => ({
							value: result.item.id,
							description: result.item.name,
						}))
					)
				},
			})

			const food = await prisma.food.findFirst({
				where: { id },
				include: { units: true },
			})

			assert(food, 'The found is not found.')

			const unitChoices = food.units
				.map((u) => ({
					name: `${u.name} (${u.amount}g)`,
					value: u.name as string | null,
					description: u.name,
				}))
				.concat([
					{
						name: 'Grams',
						value: null,
						description: 'Grams',
					},
				])

			const unit = await select({
				message: 'Unit?',
				choices: unitChoices,
			})

			const amount = await numberPrompt({
				message: 'Amount?',
				validate: positiveNumber,
			})

			return {
				id,
				unit,
				amount,
			}
		}, 'Add more ingredients?')

		const foods = await prisma.food.findMany({
			where: {
				id: {
					in: ingredients.map((i) => i.id),
				},
			},
		})

		return await prisma.recipe.create({
			data: {
				name,
				numServings,
				ingredients: {
					create: ingredients.map((i) => {
						const food = foods.find((v) => v.id === i.id)

						if (!food) throw new Error('This should not happen.')

						return {
							amount: i.amount,
							unitName: i.unit,
							foodId: food.id,
						}
					}),
				},
			},
			include: {
				ingredients: {
					include: {
						food: true,
						unit: true,
					},
				},
			},
		})
	}, 'Add another recipe?')

	console.log(chalk.green('Recipes created:'))
	for (const recipe of createdRecipes) {
		outputRecipe(recipe)
	}
}
