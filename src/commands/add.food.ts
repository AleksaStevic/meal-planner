import chalk from 'chalk'
import { confirm, input } from '@inquirer/prompts'

// DB
import { prisma } from 'db/client'

//Helpers
import { numberPrompt, repeatedInput } from 'helpers/cli'
import {
	nonEmptyString,
	nonnegativeNumber,
	positiveNumber,
	slug,
} from 'helpers/validation'
import { outputFood } from 'helpers/food'
import { nameToSlug } from 'helpers/str'

type UnitAnswers = {
	name: string
	amount: number
}

export async function run() {
	const createdFoots = await repeatedInput(async () => {
		console.log(chalk.white('Add a new food to DB:'))
		const name = await input({
			message: 'Name?',
			validate: nonEmptyString,
		})
		const answers = {
			name,
			id: await input({
				message: 'ID?',
				validate: slug,
				default: nameToSlug(name),
			}),
			macroReferenceMass: await numberPrompt({
				message: 'Calories reference mass in grams?',
				validate: positiveNumber,
				default: 100,
			}),
			packageAmount: await numberPrompt({
				message: 'What is the amount of grams per package?',
				validate: positiveNumber,
			}),
			price: await numberPrompt({
				message: 'What is the price per package?',
				validate: positiveNumber,
			}),
			divisible: await confirm({
				message: 'Is package divisble (for example, can you buy 1.5 packages)?',
				default: false,
			}),
			calories: await numberPrompt({
				message: 'Calories?',
				validate: nonnegativeNumber,
			}),
			carbs: await numberPrompt({
				message: 'Carbs?',
				validate: nonnegativeNumber,
			}),
			fat: await numberPrompt({
				message: 'Fat?',
				validate: nonnegativeNumber,
			}),
			protein: await numberPrompt({
				message: 'Protein?',
				validate: nonnegativeNumber,
			}),
		}
		const shouldAddUnits = await confirm({
			message: 'Add other units (grams are available by default)?',
		})
		let units: UnitAnswers[] = []
		if (shouldAddUnits) {
			console.log(chalk.white('Add units:'))
			units = await repeatedInput(async () => ({
				name: await input({
					message: 'Name of the unit (example: tsp)?',
					validate: nonEmptyString,
				}),
				amount: await numberPrompt({
					message: 'Amount in grams?',
					validate: positiveNumber,
				}),
			}))
		}

		return await prisma.food.create({
			data: {
				name: answers.name,
				id: answers.id,
				packageAmount: answers.packageAmount,
				price: answers.price,
				divisible: answers.divisible,
				calories: (answers.calories / answers.macroReferenceMass) * 100,
				carbs: (answers.carbs / answers.macroReferenceMass) * 100,
				fat: (answers.fat / answers.macroReferenceMass) * 100,
				protein: (answers.protein / answers.macroReferenceMass) * 100,
				units: {
					create: units,
				},
			},
		})
	}, 'Add another food?')

	console.log(chalk.green('Foods created:'))
	for (const food of createdFoots) {
		outputFood(food)
	}
}
