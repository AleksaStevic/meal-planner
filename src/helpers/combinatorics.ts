import random from 'random'

export const rnd = random.clone(31462)

export function chooseRepeating<T>(arr: T[], k: number): T[] {
	const result: T[] = []
	for (let i = 0; i < k; i++) {
		const randomIndex = rnd.int(0, arr.length - 1)
		result.push(arr[randomIndex])
	}
	return result
}
