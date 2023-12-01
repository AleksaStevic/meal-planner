import chalk from 'chalk'
import { prisma } from 'db/client'
import { outputMacroGoal } from 'helpers/macro.goal'

export async function run(id: string) {
	const goal = await prisma.macroGoal.findFirst({
		where: {
			id,
		},
		include: {
			conditions: true,
		},
	})

	if (!goal) {
		console.error(chalk.red(`Macro goal with ID: ${id} not found.`))
		return
	}

	outputMacroGoal(goal)
}
