import { rnd } from 'helpers/combinatorics.ts'
import { SelectionStrategy } from './types.ts'

export function tournamentSelection<Individual>(
	tournamentSize: number
): SelectionStrategy<Individual> {
	return (
		population: Individual[],
		calcFitness: (individual: Individual) => number
	) => {
		const participans: Individual[] = []

		// Randomly select individuals for the tournament
		for (let i = 0; i < tournamentSize; i++) {
			const randomIndex = rnd.int(0, population.length - 1)
			participans.push(population[randomIndex])
		}

		// Find the individual with the highest fitness in the tournament
		let fittest = participans[0]
		for (let i = 1; i < participans.length; i++) {
			if (calcFitness(participans[i]) > calcFitness(fittest)) {
				fittest = participans[i]
			}
		}

		return fittest
	}
}

export function rouletteWheelSelection<
	Individual
>(): SelectionStrategy<Individual> {
	return (
		population: Individual[],
		calcFitness: (individual: Individual) => number
	) => {
		const totalFitness = population.reduce(
			(sum, individual) => sum + calcFitness(individual),
			0
		)
		const pick = Math.random() * totalFitness
		let currentSum = 0

		for (const individual of population) {
			currentSum += calcFitness(individual)
			if (currentSum >= pick) {
				return individual
			}
		}

		return population[population.length - 1] // Fallback in case of rounding errors
	}
}

export function rankSelection<Individual>(
	survivingSize: number
): SelectionStrategy<Individual> {
	return (
		population: Individual[],
		calcFitness: (individual: Individual) => number
	) => {
		const sortedPopulation = [...population].sort(
			(a, b) => calcFitness(b) - calcFitness(a)
		)

		const index = rnd.int(0, survivingSize - 1)

		return sortedPopulation[index]
	}
}
