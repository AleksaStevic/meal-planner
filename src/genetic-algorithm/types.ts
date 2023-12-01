export type SelectionStrategy<DNAPart> = (
	population: Individual<DNAPart>[]
) => Individual<DNAPart>

export type GAOptions<DNAPart> = {
	pool: DNAPart[]
	fitness: (i: DNAPart[][]) => number
	selectionStrategy: SelectionStrategy<DNAPart>
	populationSize: number
	mutationRate: number
	maxGenerations: number
	dnaLength: number
}

export type Individual<DNAPart> = {
	dna: DNAPart[][]
	fitness: number
}
