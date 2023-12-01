import { confirm } from '@inquirer/prompts'

// DB
import { MacroGoalWithConditions, prisma } from 'db/client.ts'

// Helpers
import { circleHalvesSpinner as spinner } from 'helpers/output'
import { createWorker } from 'helpers/workers'
import { Individual } from 'genetic-algorithm/types'
import { RecipeData } from 'workers/meal-plan-generator/types'
import { outputRecipeData } from 'helpers/str'

export async function run(goalId: string) {
	const goal = await prisma.macroGoal.findFirst({
		where: { id: goalId },
		include: {
			conditions: true,
		},
	})
	if (!goal) {
		throw new Error('Goal not found.')
	}
	spinner.start('Generating meal plan...')
	const generatorWorker = createWorker<
		MacroGoalWithConditions,
		Individual<RecipeData>
	>(new URL('../workers/meal-plan-generator/worker.ts', import.meta.url))
	const data = await generatorWorker.run(goal)
	spinner.succeed('Meal plan generated.')

	outputRecipeData(data.dna)

	if (await confirm({ message: 'Do you want to save this meal plan?' })) {
		await prisma.mealPlan.create({
			data: {
				days: {
					create: data.dna.map((day, i) => ({
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
