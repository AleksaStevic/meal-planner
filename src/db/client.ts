import { Prisma, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

const goalWithConditions = Prisma.validator<Prisma.MacroGoalDefaultArgs>()({
	include: {
		conditions: true,
	},
})

export type MacroGoalWithConditions = Prisma.MacroGoalGetPayload<
	typeof goalWithConditions
>
