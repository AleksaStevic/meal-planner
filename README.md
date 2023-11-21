# Meal Planner CLI

## Quickstart

- Install bun and sqlite3.
- Run `bun src/main.ts food add` to add ingredient interactively (or multiple foods).
- Run `bun src/main.ts recipe add` to add recipe interactively. Add multiple recipes.
- Run `bun src/main.ts macro-goal add 1800 "<100" "<50" ">150"` to create a new macro goal.
- Run `bun src/main.ts meal-plan generate <macro-goal-id>` to generate a new meal plan.
- You'll be asked to save the meal plan. Choose to do it.
- Run `bun src/main.ts shopping-list generate <meal-plan-id>` to create a new shopping list from the meal plan.

## Available commands

Run `bun src/main.ts --help` to view all available commands.
