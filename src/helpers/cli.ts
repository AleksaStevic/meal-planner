import { confirm, input } from '@inquirer/prompts'

export async function repeatedInput<Answer>(
	askForAnswer: () => Promise<Answer> | Answer,
	askAgainQuestion = 'Add more?'
) {
	const allAnswers: Answer[] = []

	async function ask(answers: Answer[]) {
		answers.push(await askForAnswer())
		const askAgain = await confirm({ message: askAgainQuestion })

		if (askAgain) await ask(answers)
	}

	await ask(allAnswers)

	return allAnswers
}

type NumberPromptParams = {
	validate?: (v: number) => string | boolean
	message: string
	default?: number
}

export async function numberPrompt(params: NumberPromptParams) {
	const { validate, message, default: defaultValue } = params

	return parseFloat(
		await input({
			message,
			validate: validate ? (i) => validate(parseFloat(i)) : undefined,
			default: defaultValue?.toString(),
		})
	)
}
