import { type Prisma, type PrismaClient } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'

const entityName = 'user'
type CreateInput = Prisma.UserUncheckedCreateInput

export const users = [
  _create({
    id: 'tz4a98xxat96iws9zmbrgj3a',
    name: 'first',
    password: 'password',
  }),
] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    id: defaultValues.id ?? createId(),
    name: defaultValues.name ?? createId(),
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
