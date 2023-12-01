import { chooseRepeating, rnd } from 'helpers/combinatorics'
import { GAOptions, Individual, SelectionStrategy } from './types'

export class GeneticOptimizer<DNAPart> {
	dnaPool: DNAPart[]
	fitness: (i: DNAPart[][]) => number
	selectionStrategy: SelectionStrategy<DNAPart>
	populationSize: number
	mutationRate: number
	maxGenerations: number
	dnaLength: number

	constructor(options: GAOptions<DNAPart>) {
		this.dnaPool = options.pool
		this.fitness = options.fitness
		this.selectionStrategy = options.selectionStrategy
		this.populationSize = options.populationSize
		this.mutationRate = options.mutationRate
		this.maxGenerations = options.maxGenerations
		this.dnaLength = options.dnaLength
	}

	run() {
		let population = [...Array(this.populationSize)].map(() =>
			this.randomIndividual()
		)

		for (let gen = 0; gen < this.maxGenerations; ++gen) {
			population = [...Array(this.populationSize)].map((_, index) => {
				const [p1, p2] = this.selectParents(population)
				let child = this.crossover(p1, p2)
				child = this.mutate(child)
				return child
			})
		}

		return population
	}

	randomIndividual(): Individual<DNAPart> {
		const dna: DNAPart[][] = []
		for (let i = 0; i < this.dnaLength; ++i) {
			const numOfMeals = rnd.int(3, 6)
			dna.push(chooseRepeating(this.dnaPool, numOfMeals))
		}

		return {
			dna,
			fitness: this.fitness(dna),
		}
	}

	selectParents(population: Individual<DNAPart>[]) {
		return [
			this.selectionStrategy(population),
			this.selectionStrategy(population),
		] as [Individual<DNAPart>, Individual<DNAPart>]
	}

	crossover(
		p1: Individual<DNAPart>,
		p2: Individual<DNAPart>
	): Individual<DNAPart> {
		const dna1 = p1.dna
		const dna2 = p2.dna
		const index = rnd.int(0, dna1.length - 1)
		const newDNA = [...dna1.slice(0, index), ...dna2.slice(index)]
		return {
			dna: newDNA,
			fitness: this.fitness(newDNA),
		}
	}

	mutate(individual: Individual<DNAPart>): Individual<DNAPart> {
		const newDNA = structuredClone(individual.dna)

		for (let i = 0; i < newDNA.length; ++i) {
			if (rnd.float(0, 1) <= this.mutationRate) {
				const indexToRemove = rnd.int(0, newDNA[i].length - 1)
				const indexToAdd = rnd.int(0, this.dnaPool.length - 1)
				newDNA[i].splice(indexToRemove, 1, this.dnaPool[indexToAdd])
			}
		}

		return {
			dna: newDNA,
			fitness: this.fitness(newDNA),
		}
	}
}
