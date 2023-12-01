import { Command } from '@commander-js/extra-typings'

// Commands
import { run as runMealPlan } from 'commands/meal.plan'
import { run as runShowMealPlan } from 'commands/show.meal.plan'
import { run as runDeleteMealPlan } from 'commands/delete.meal.plan'
import { run as runImportFoods } from 'commands/import.foods'
import { run as runImportRecipes } from 'commands/import.recipes'
import { run as runAddFood } from 'commands/add.food'
import { run as runDeleteFood } from 'commands/delete.food'
import { run as runAddRecipe } from 'commands/add.recipe'
import { run as runShoppingList } from 'commands/shopping.list'
import { run as runDeleteRecipes } from 'commands/delete.recipes'
import { run as runShow } from 'commands/show'
import { run as runAddGoal } from 'commands/add.goal'
import { run as runShowGoal } from 'commands/show.goal'
import { run as runDeleteGoal } from 'commands/delete.goal'

// package.json
import { version } from '../package.json'
import chalk from 'chalk'

const program = new Command()
	.name('meal-planner')
	.description('CLI for meal planning.')
	.version(version)

const recipeCmd = program.command('recipe').description('Recipe CLI.')
const foodCmd = program.command('food').description('Food CLI.')
const mealPlanCmd = program.command('meal-plan').description('Meal plan CLI.')
const goalCmd = program.command('macro-goal').description('Macro goal CLI.')
const shoppingListCmd = program
	.command('shopping-list')
	.description('Shopping list CLI.')

// Recipes:
recipeCmd
	.command('import')
	.description('Import recipes from JSON/YAML.')
	.argument('<file>', 'File to import from.')
	.action(runImportRecipes)

recipeCmd
	.command('add')
	.description('Add recipe interactively.')
	.action(runAddRecipe)

recipeCmd
	.command('delete')
	.description('Delete recipes.')
	.argument('[ids...]', 'Redcipe IDs.')
	.action(runDeleteRecipes)

// Foods:
foodCmd
	.command('import')
	.description('Import foods from JSON/YAML.')
	.argument('<file>', 'File to import from.')
	.action(runImportFoods)

foodCmd.command('add').description('Add food interactively.').action(runAddFood)

foodCmd
	.command('delete')
	.description('Delete foods.')
	.argument('[ids...]', 'Food IDs.')
	.action(runDeleteFood)

// Meal Plans:
mealPlanCmd
	.command('generate')
	.description('Generate a new meal plan.')
	.argument('<macro-goal-id>', 'Generate a new meal plan.')
	.action(runMealPlan)

mealPlanCmd
	.command('show')
	.description('Show meal plan.')
	.argument('<meal-plan-id>', 'Show meal plan.')
	.action(runShowMealPlan)

mealPlanCmd
	.command('delete')
	.description("Delete meal plan given it's id.")
	.argument('<meal-plan-id>', 'Meal plan ID')
	.action(runDeleteMealPlan)

// Macro goals:
goalCmd
	.command('add')
	.description('Add new macro goal')
	.arguments('<name> <calories> <carbs-range> <fat-range> <protein-range>')
	.action(runAddGoal)

goalCmd
	.command('show')
	.description('Show macro goal.')
	.argument('<id>', 'Macro goal id.')
	.action(runShowGoal)

goalCmd
	.command('delete')
	.description('Delete macro goal')
	.argument('<id>', 'Macro goal id')
	.action(runDeleteGoal)

// Shopping list:
shoppingListCmd
	.command('generate')
	.description('Generate a new shopping list from meal plan.')
	.arguments('<meal-plan-id>')
	.action(runShoppingList)

// Other
program
	.command('show')
	.description('Show recipe/food details.')
	.argument('<id-or-name>', 'ID of the food/recipe.')
	.action(runShow)

try {
	await program.parseAsync(Bun.argv)
} catch (e) {
	if (e instanceof Error) {
		console.error(chalk.red(e.message))
	}
}
