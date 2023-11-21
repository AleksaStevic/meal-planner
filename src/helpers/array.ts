export function transpose<T>(matrix: T[][]) {
	const normalized = normalize(structuredClone(matrix))
	const cols = normalized[0].length
	const transposed: (T | null)[][] = []

	for (let i = 0; i < cols; ++i) {
		transposed[i] = normalized.map((row) => row[i])
	}

	return transposed
}

export function normalize<T>(matrix: T[][]) {
	const rows = matrix.length
	const cols = matrix.reduce(
		(acc, row) => (row.length > acc ? row.length : acc),
		0,
	)

	const normalized: (T | null)[][] = []
	for (let i = 0; i < rows; ++i) {
		normalized[i] = []
		for (let j = 0; j < cols; ++j) {
			normalized[i][j] = matrix[i][j] ?? null
		}
	}

	return normalized
}
