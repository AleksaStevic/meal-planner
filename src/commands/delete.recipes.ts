import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'

// DB
import { prisma } from 'db/client'

export async function run(ids?: string[]) {
	const message = !ids
		? 'Are you sure you want to delete ALL recipes?'
		: 'Are you sure you want to delete recipes?'
	const shouldDelete = await confirm({
		message,
	})

	if (!shouldDelete) return

	await (!ids
		? prisma.recipe.deleteMany({})
		: prisma.recipe.deleteMany({
				where: {
					id: {
						in: ids,
					},
				},
		  }))

	console.log(chalk.green('Successfully deleted recipes.'))
}
