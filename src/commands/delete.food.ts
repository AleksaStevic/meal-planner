import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'

// DB
import { prisma } from 'db/client'

export async function run(ids: string[]) {
	const message = !ids
		? 'Are you sure you want to delete ALL foods?'
		: 'Are you sure you want to delete foods?'
	const shouldDelete = await confirm({
		message,
	})

	if (!shouldDelete) return

	await (!ids
		? prisma.food.deleteMany({})
		: prisma.food.deleteMany({
				where: {
					id: {
						in: ids,
					},
				},
		  }))

	console.log(chalk.green('Successfully deleted foods.'))
}
