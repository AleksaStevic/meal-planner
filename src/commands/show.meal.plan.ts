import chalk from 'chalk'

// DB
import { prisma } from 'db/client'

// Helpers
import { outputMealPlan } from 'helpers/meal.plan'

export async function run(id: string) {
	const mealPlan = await prisma.mealPlan.findFirst({
		where: { id },
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
				orderBy: {
					order: 'asc',
				},
			},
		},
	})

	if (!mealPlan) {
		console.error(chalk.red(`Meal plan with ID: ${id} not found.`))
		return
	}

	outputMealPlan(mealPlan)
}
