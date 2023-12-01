export function expDecay(x: number) {
	return Math.exp(-10 * (x - 1) * (x - 1)) - 0.5
}

/**
 * This function expresses exponential decay function that is skewed (more sharp)
 * to the right side.
 *
 * - When `x` < 1 the function is `exp(-0.5*(x-1)^2) - 1/2`
 * - When `x` > 1 the function is `exp(-10*(x-1)^2) - 1/2`
 * - When `x` = 1 the function returns `1/2`.
 *
 * @param x Parameter
 */
export function expDecaySkewedRight(x: number) {
	if (x === 1) return 0.5

	return (
		(x < 1
			? Math.exp(-0.5 * (x - 1) * (x - 1))
			: Math.exp(-10 * (x - 1) * (x - 1))) - 0.5
	)
}

/**
 * This function expresses exponential decay function that is skewed (more sharp)
 * to the left side.
 *
 * - When `x` > 1 the function is `exp(-0.5*(x-1)^2) - 1/2`
 * - When `x` < 1 the function is `exp(-10*(x-1)^2) - 1/2`
 * - When `x` = 1 the function returns `1/2`.
 *
 * @param x Parameter
 */
export function expDecaySkewedLeft(x: number) {
	if (x === 1) return 0.5

	return (
		(x < 1
			? Math.exp(-10 * (x - 1) * (x - 1))
			: Math.exp(-0.5 * (x - 1) * (x - 1))) - 0.5
	)
}
