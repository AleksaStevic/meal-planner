import path from 'node:path'
import yaml from 'yaml'
import chalk from 'chalk'
import { z } from 'zod'

// DB
import { prisma } from 'db/client'

// Helpers
import { outputRecipe } from 'helpers/recipe'

const recipeJsonSchema = z.array(
	z.object({
		name: z.string().min(3),
		numServings: z.optional(z.number().int().min(1)),
		ingredients: z.array(
			z.object({
				foodId: z.string().min(2),
				amount: z.number().positive(),
				unitName: z.string().min(1).nullable(),
			})
		),
	})
)

export async function run(filePath: string) {
	const file = await Bun.file(filePath)
	const fileContent = await file.text()
	const ext = path.extname(filePath)
	const json =
		ext === '.json' ? JSON.parse(fileContent) : yaml.parse(fileContent)

	// @todo(alekas): handle ZodError
	const recipes = recipeJsonSchema.parse(json)

	const results = await Promise.allSettled(
		recipes.map((recipe) =>
			prisma.recipe.create({
				data: {
					name: recipe.name,
					numServings: recipe.numServings,
					ingredients: {
						create: recipe.ingredients,
					},
				},
				include: {
					ingredients: {
						include: {
							food: true,
							unit: true,
						},
					},
				},
			})
		)
	)

	for (let i = 0; i < results.length; ++i) {
		const result = results[i]
		const recipe = recipes[i]
		if (result.status === 'rejected') {
			console.error(
				chalk.red(`Failed to create recipe: "${recipe.name}", reason:`)
			)
			console.error(result.reason)
		}
		if (result.status === 'fulfilled') {
			console.log(chalk.green('Sucessfully imported:'))
			outputRecipe(result.value)
		}
	}
}
