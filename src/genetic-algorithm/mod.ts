import { rnd } from 'helpers/combinatorics'
import {
	GACrossoverParams,
	GAMutateParams,
	GAOptions,
	GASelectParentsParams,
} from './types'

function selectParents<Individual>(params: GASelectParentsParams<Individual>) {
	const { population, calcFitness, strategy: selection } = params

	return [
		selection(population, calcFitness),
		selection(population, calcFitness),
	] as [Individual, Individual]
}

function crossover<Individual, DNAPart>(
	params: GACrossoverParams<Individual, DNAPart[][]>
) {
	const { p1, p2, getDNA, createIndividual } = params

	const dna1 = getDNA(p1)
	const dna2 = getDNA(p2)
	const index = rnd.int(0, dna1.length - 1)
	const newDNA = [...dna1.slice(0, index), ...dna2.slice(index)]
	return createIndividual(newDNA)
}

function mutate<Individual, DNAPart>(
	params: GAMutateParams<Individual, DNAPart, DNAPart[][]>
) {
	const { individual, mutationRate, getDNA, pool, createIndividual } = params

	const newDNA = structuredClone(getDNA(individual))

	for (let i = 0; i < newDNA.length; ++i) {
		if (newDNA[i] instanceof Array) {
			if (rnd.float(0, 1) <= mutationRate) {
				const indexToRemove = rnd.int(0, newDNA[i].length - 1)
				const indexToAdd = rnd.int(0, pool.length - 1)
				newDNA[i].splice(indexToRemove, 1, pool[indexToAdd])
			}
		}
	}

	return createIndividual(newDNA)
}

// @TODO: dna is fixed currently to be one dimensional array
export function geneticAlgorithm<Individual, DNAPart>(
	options: GAOptions<Individual, DNAPart, DNAPart[][]>
) {
	const {
		pool,
		randomIndividual,
		getDNA,
		createIndividual,
		calcFitness,
		selectionStrategy,
		mutationRate,
		maxGenerations,
		populationSize,
	} = options

	let population = [...Array(populationSize)].map(() => randomIndividual(pool))

	for (let gen = 0; gen < maxGenerations; ++gen) {
		population = [...Array(populationSize)].map(() => {
			const [p1, p2] = selectParents({
				population,
				strategy: selectionStrategy,
				calcFitness,
			})
			let child = crossover({ p1, p2, getDNA, createIndividual })
			child = mutate({
				individual: child,
				getDNA,
				createIndividual,
				pool,
				mutationRate,
			})
			return child
		})
	}

	return population
}
