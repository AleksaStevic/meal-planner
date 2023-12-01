import { expDecay, expDecaySkewedLeft, expDecaySkewedRight } from 'helpers/math'
import { MacroGoalWithConditions, prisma } from 'db/client'
import { rankSelection } from 'genetic-algorithm/selection.strategy'
import { GeneticOptimizer } from 'genetic-algorithm/mod'
import { extractRecipeData } from 'helpers/recipe'
import { RecipeData } from './types'

declare var self: Worker

function getDecayFunction(type: string) {
	switch (type) {
		case 'min':
			return expDecaySkewedLeft
		case 'max':
			return expDecaySkewedRight
		case 'exact':
			return expDecay
		default:
			throw new Error(`Macro type is not available ${type}`)
	}
}

function dayFitness(day: RecipeData[], goal: MacroGoalWithConditions) {
	const dayValues = {
		calories: day.reduce((acc, r) => r.calories + acc, 0),
		carbs: day.reduce((acc, r) => r.carbs + acc, 0),
		fat: day.reduce((acc, r) => r.fat + acc, 0),
		protein: day.reduce((acc, r) => acc + r.protein, 0),
	}

	let sum = 0
	for (const { type, macro, value } of goal.conditions) {
		if (
			macro !== 'calories' &&
			macro !== 'carbs' &&
			macro !== 'fat' &&
			macro !== 'protein'
		)
			throw new Error('Macro name not found.')
		sum += getDecayFunction(type)(dayValues[macro] / value)
	}

	return sum * 100
}

function calcFitness(recipes: RecipeData[][], goal: MacroGoalWithConditions) {
	return recipes
		.map((day) => dayFitness(day, goal))
		.reduce((acc, v) => acc + v, 0)
}

self.onmessage = async (e: MessageEvent<MacroGoalWithConditions>) => {
	const goal = e.data
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

	const optimizer = new GeneticOptimizer({
		pool,
		populationSize: 500,
		maxGenerations: 50,
		mutationRate: 0.05,
		selectionStrategy: rankSelection(100),
		fitness: (recipes: RecipeData[][]) => calcFitness(recipes, goal),
		dnaLength: 7,
	})

	const lastGen = optimizer.run()

	let best = lastGen[0]

	for (const plan of lastGen) {
		if (plan.fitness > best.fitness) best = plan
	}

	self.postMessage(best)
}
