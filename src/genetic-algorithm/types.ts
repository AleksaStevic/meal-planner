export type SelectionStrategy<T> = (
	population: T[],
	calcFitness: (individual: T) => number
) => T

// DNA = RecipeData
export type GAOptions<Individual, DNAPart, DNA = DNAPart[]> = {
	pool: DNAPart[]
	randomIndividual: (pool: DNAPart[]) => Individual
	createIndividual: (dna: DNA) => Individual
	getDNA: (individual: Individual) => DNA
	calcFitness: (i: Individual) => number
	selectionStrategy: SelectionStrategy<Individual>
	populationSize: number
	mutationRate: number
	maxGenerations: number
}

export type GACrossoverParams<Individual, DNA> = {
	p1: Individual
	p2: Individual
	getDNA: (individual: Individual) => DNA
	createIndividual: (dna: DNA) => Individual
}

export type GAMutateParams<Individual, DNAPart, DNA = DNAPart[]> = {
	pool: DNAPart[]
	individual: Individual
	mutationRate: number
	getDNA: (individual: Individual) => DNA
	createIndividual: (dna: DNA) => Individual
}

export type GASelectParentsParams<Individual> = {
	population: Individual[]
	strategy: SelectionStrategy<Individual>
	calcFitness: (i: Individual) => number
}
