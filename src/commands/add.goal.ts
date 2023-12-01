// DB
import { prisma } from 'db/client.ts'

// Helpers
import { outputMacroGoal } from 'helpers/macro.goal.ts'

function parse(input: string, maxCalories: number) {
	if (input.startsWith('<')) {
		return {
			value: parseFloat(input.replace(/[^0-9]+/, '')),
			type: 'max' as const,
		}
	}

	if (input.startsWith('>')) {
		return {
			value: parseFloat(input.replace(/[^0-9]+/, '')),
			type: 'min' as const,
		}
	}

	if (input.endsWith('%')) {
		return {
			value: (parseFloat(input.replace(/[^0-9]+/, '')) * maxCalories) / 100,
			type: 'exact' as const,
		}
	}

	return {
		value: parseFloat(input.replace(/[^0-9]+/, '')),
		type: 'exact' as const,
	}
}

type Condition = {
	macro: string
	value: number
	type: 'min' | 'max' | 'exact'
}

export async function run(
	name: string,
	caloriesGoal: string,
	carbsRange: string,
	fatRange: string,
	proteinRange: string
) {
	const maxCalories = parseFloat(caloriesGoal)

	const conditions: Condition[] = [
		{
			macro: 'calories',
			value: maxCalories,
			type: 'max',
		},
		{
			macro: 'carbs',
			...parse(carbsRange, maxCalories),
		},
		{
			macro: 'fat',
			...parse(fatRange, maxCalories),
		},
		{
			macro: 'protein',
			...parse(proteinRange, maxCalories),
		},
	]

	const macroGoal = await prisma.macroGoal.create({
		data: {
			id: name,
			conditions: {
				create: conditions,
			},
		},
		include: {
			conditions: true,
		},
	})

	outputMacroGoal(macroGoal)
}
