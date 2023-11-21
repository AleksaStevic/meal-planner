import chalk from 'chalk'

// DB
import { prisma } from 'db/client'

// Helpers
import { outputFood } from 'helpers/food'
import { outputRecipe } from 'helpers/recipe'

export async function run(param: string) {
	// Try to find recipe first
	const recipe = await prisma.recipe.findFirst({
		where: {
			OR: [
				{
					id: param,
				},
				{
					name: param,
				},
			],
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

	if (recipe) {
		outputRecipe(recipe)
		return
	}

	const food = await prisma.food.findFirst({
		where: {
			OR: [
				{
					id: param,
				},
				{
					name: param,
				},
			],
		},
	})

	if (food) {
		outputFood(food)
		return
	}

	console.log(chalk.yellow('Could not find recipe/food in DB.'))
}
