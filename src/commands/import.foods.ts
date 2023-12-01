import path from 'node:path'
import { Prisma } from '@prisma/client'
import yaml from 'yaml'
import chalk from 'chalk'
import { z } from 'zod'

// DB
import { prisma } from 'db/client'

// Helpers
import { nameToSlug } from 'helpers/str'
import { outputFood } from 'helpers/food'

const foodSchema = z.array(
	z.object({
		name: z.string().min(3),
		id: z.optional(z.string().min(3)),
		calories: z.number().nonnegative(),
		carbs: z.number().nonnegative(),
		fat: z.number().nonnegative(),
		protein: z.number().nonnegative(),
		packageAmount: z.number().positive(),
		price: z.number().nonnegative(),
		units: z.optional(
			z.array(
				z.object({
					name: z.string().min(1),
					amount: z.number().positive(),
				})
			)
		),
	})
)

export async function run(filePath: string) {
	const file = await Bun.file(filePath).text()
	const extension = path.extname(filePath)
	const data =
		extension === '.json'
			? JSON.parse(file.toString())
			: yaml.parse(file.toString())

	// @todo(alekas): handle ZodError
	const foods = foodSchema.parse(data)

	const results = await Promise.allSettled(
		foods.map((food) =>
			prisma.food.create({
				data: {
					id: nameToSlug(food.name),
					name: food.name,
					calories: food.calories,
					carbs: food.carbs,
					fat: food.fat,
					protein: food.protein,
					packageAmount: food.packageAmount,
					packagePrice: food.price,
					units: {
						create: food.units,
					},
				},
			})
		)
	)

	for (let i = 0; i < results.length; ++i) {
		const result = results[i]
		const food = foods[i]
		if (result.status === 'rejected') {
			if (
				result.reason instanceof Prisma.PrismaClientKnownRequestError &&
				result.reason.code === 'P2002'
			) {
				console.error(
					chalk.red(
						`Food with slug: "${
							food.id ?? nameToSlug(food.name)
						}" already exsits.`
					)
				)
			}
		}
		if (result.status === 'fulfilled') {
			console.log(chalk.green('Sucessfully imported:'))
			outputFood(result.value)
		}
	}
}
