import { prisma } from '../../db/client'
import { geneticAlgorithm } from '../../genetic-algorithm/mod'
import { rankSelection } from '../../genetic-algorithm/selection.strategy'
import { extractRecipeData } from '../../helpers/recipe'
import { MealPlan, randomMealPlan } from './meal.plan'
import { RecipeData } from './types'

declare var self: Worker

self.onmessage = async (e: MessageEvent) => {
	const pool = (
		await prisma.recipe.findMany({
			include: {
				ingredients: {
					include: {
						food: true,
						unit: true,
					},
				},
			},
		})
	).map((recipe) => extractRecipeData(recipe))

	const lastGen = geneticAlgorithm<MealPlan, RecipeData>({
		pool,
		populationSize: 500,
		maxGenerations: 50,
		mutationRate: 0.05,
		selectionStrategy: rankSelection(100),
		randomIndividual: randomMealPlan,
		createIndividual: (dna) => new MealPlan(dna),
		getDNA: (plan: MealPlan) => plan.days,
		calcFitness: (plan: MealPlan) => plan.fitness,
	})

	let best = lastGen[0]

	for (const plan of lastGen) {
		if (plan.fitness > best.fitness) best = plan
	}

	self.postMessage(best)
}
