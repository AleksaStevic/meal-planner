import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'

// DB
import { prisma } from 'db/client'

export async function run(id: string) {
	const shouldDelete = await confirm({
		message: 'Are you sure you wanna delete macro goal?',
	})

	if (!shouldDelete) return

	await prisma.macroGoal.delete({
		where: {
			id,
		},
	})

	console.log(chalk.green('Successfully deleted macro goal.'))
}
