import { strict as assert } from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import boxen from 'boxen'
import chalk from 'chalk'
import { format } from './output'
import { capitalize } from './str'

const macroGoalWithConditions = Prisma.validator<Prisma.MacroGoalDefaultArgs>()(
	{
		include: {
			conditions: true,
		},
	}
)

type MacroGoalWithConditions = Prisma.MacroGoalGetPayload<
	typeof macroGoalWithConditions
>

export function outputMacroGoal(goal: MacroGoalWithConditions) {
	const textMap = {
		min: 'more than',
		max: 'less than',
		exact: 'exact target',
	}

	const content = goal.conditions
		.map((cond) => {
			assert(
				// @ts-ignore
				typeof textMap[cond.type] !== 'undefined',
				`Unknown condition type: ${cond.type}`
			)
			// @ts-ignore
			return `${capitalize(cond.macro)}: ${textMap[cond.type]} ${format(
				cond.value,
				cond.macro === 'calories' ? 'kcal' : 'gram'
			)}`
		})
		.concat([`ID: ${goal.id}`])
		.join('\n')

	console.log(
		boxen(content, {
			title: chalk.white(goal.id),
			titleAlignment: 'center',
			padding: 0.5,
		})
	)
}
