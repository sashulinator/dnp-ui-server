import { type Prisma, type PrismaClient } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'

const entityName = 'user'
type CreateInput = Prisma.UserUncheckedCreateInput

export const users = [
  _create({
    id: 'system',
    name: 'system',
    password: 'system',
    avatar: 'https://static.tildacdn.com/tild3934-3136-4135-b465-646463343633/2.png',
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    id: defaultValues.id ?? createId(),
    name: defaultValues.name ?? createId(),
    avatar:
      'https://play-lh.googleusercontent.com/ccszZWb16OvEbitvRrk6MI4AXrWeTfSMAK-qB1Z0IYZvnob-SPctGcTR_CJgBsxg3N8=s128',
    password: 'password',
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ name: `seeded-name-${i}` })
}

export default async function seedEntities(prisma: PrismaClient) {
  const generatedEntities = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...users, ...generatedEntities]
  const seedPromises = allSeeds.map((seed) => prisma[entityName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
