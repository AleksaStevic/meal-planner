import { rnd } from 'helpers/combinatorics.ts'
import { Individual, SelectionStrategy } from './types.ts'

export function tournamentSelection<DNAPart>(
	tournamentSize: number
): SelectionStrategy<DNAPart> {
	return (population: Individual<DNAPart>[]) => {
		const participans: Individual<DNAPart>[] = []

		// Randomly select individuals for the tournament
		for (let i = 0; i < tournamentSize; i++) {
			const randomIndex = rnd.int(0, population.length - 1)
			participans.push(population[randomIndex])
		}

		// Find the individual with the highest fitness in the tournament
		let fittest = participans[0]
		for (let i = 1; i < participans.length; i++) {
			if (participans[i].fitness > fittest.fitness) {
				fittest = participans[i]
			}
		}

		return fittest
	}
}

export function rouletteWheelSelection<DNAPart>(): SelectionStrategy<DNAPart> {
	return (population: Individual<DNAPart>[]) => {
		const totalFitness = population.reduce(
			(sum, individual) => sum + individual.fitness,
			0
		)
		const pick = Math.random() * totalFitness
		let currentSum = 0

		for (const individual of population) {
			currentSum += individual.fitness
			if (currentSum >= pick) {
				return individual
			}
		}

		return population[population.length - 1] // Fallback in case of rounding errors
	}
}

export function rankSelection<DNAPart>(
	survivingSize: number
): SelectionStrategy<DNAPart> {
	return (population: Individual<DNAPart>[]) => {
		const sortedPopulation = [...population].sort(
			(a, b) => b.fitness - a.fitness
		)

		const index = rnd.int(0, survivingSize - 1)

		return sortedPopulation[index]
	}
}
