import { confirm } from '@inquirer/prompts'

// DB
import { prisma } from 'db/client.ts'

// Workers
import { MealPlan } from 'workers/meal-plan-generator/meal.plan'

// Helpers
import { circleHalvesSpinner as spinner } from 'helpers/output'
import { promisify } from 'helpers/workers'

export async function run(goalId: string) {
	spinner.start('Generating meal plan...')
	const generatorWorker = promisify<{}, MealPlan>(
		new URL('../workers/meal-plan-generator/worker.ts', import.meta.url)
	)
	const data = await generatorWorker.run({})
	const best = new MealPlan(data.days)
	spinner.succeed('Meal plan generated.')
	best.output()

	if (await confirm({ message: 'Do you want to save this meal plan?' })) {
		await prisma.mealPlan.create({
			data: {
				days: {
					create: best.days.map((day, i) => ({
						order: i,
						recipes: {
							create: day.map((recipe) => ({
								recipeId: recipe.id,
							})),
						},
					})),
				},
				goalId,
			},
		})
	}

	generatorWorker.terminate()
}
