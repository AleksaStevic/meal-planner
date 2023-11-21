import chalk from 'chalk'
import { getBorderCharacters, table } from 'table'

// DB
import { prisma } from 'db/client'

// Helpers
import { format } from 'helpers/output'

export async function run(planId: string) {
	const mealPlan = await prisma.mealPlan.findFirst({
		where: {
			id: planId,
		},
		include: {
			days: {
				include: {
					recipes: {
						include: {
							recipe: {
								include: {
									ingredients: {
										include: {
											food: true,
											unit: true,
										},
									},
								},
							},
						},
					},
				},
				orderBy: {
					order: 'asc',
				},
			},
		},
	})

	if (!mealPlan) {
		console.error(chalk.red(`Meal plan with ID: ${planId} not found.`))
		return
	}

	const shoppingList: Record<
		string,
		{
			amount: number // Total in grams
			packageNumber: number // number of packages
			packageAmount: number // Grams per package
			packagePrice: number // Price per package
			price: number // total price
			divisble: boolean
			leftover: number // Amount in grams that is leftover
		}
	> = {}
	for (const day of mealPlan.days) {
		for (const { recipe } of day.recipes) {
			for (const ingredient of recipe.ingredients) {
				if (!(ingredient.food.name in shoppingList)) {
					shoppingList[ingredient.food.name] = {
						price: 0,
						packageNumber: 0,
						packageAmount: 0,
						packagePrice: 0,
						amount: 0,
						divisble: false,
						leftover: 0,
					}
				}

				const listItem = shoppingList[ingredient.food.name]

				listItem.amount += ingredient.amount * (ingredient.unit?.amount ?? 1)
				listItem.divisble = ingredient.food.divisible
				listItem.packageAmount = ingredient.food.packageAmount
				listItem.packagePrice = ingredient.food.packagePrice
			}
		}
	}

	for (const info of Object.values(shoppingList)) {
		info.packageNumber = info.amount / info.packageAmount
		if (!info.divisble) info.packageNumber = Math.ceil(info.packageNumber)
		info.price = info.packageNumber * info.packagePrice
		info.leftover = info.packageNumber * info.packageAmount - info.amount
	}

	const t = table(
		[
			[
				'Name',
				'Amount (g)',
				'# Packages',
				'Price per package',
				'Total Price',
				'Leftover',
			],
			...Object.entries(shoppingList).map(([food, info]) => [
				food,
				format(info.amount, 'gram'),
				format(info.packageNumber, ''),
				format(info.packagePrice, 'currency'),
				format(info.price, 'currency'),
				format(info.leftover, 'gram'),
			]),
			[
				'',
				'',
				'',
				'Total price:',
				format(
					Object.values(shoppingList).reduce((acc, v) => acc + v.price, 0),
					'currency'
				),
				'',
			],
		],
		{
			border: getBorderCharacters('norc'),
		}
	)

	console.log(t)
}
