import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { prisma } from 'db/client'

export async function run(id: string) {
	const shouldDelete = await confirm({
		message: 'Are you sure you want to delete meal plan?',
	})

	if (!shouldDelete) return

	await prisma.mealPlan.delete({
		where: {
			id,
		},
	})

	console.log(chalk.green('Successfully deleted meal plan.'))
}
