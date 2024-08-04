import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

const entityName = 'tableSchema'
type CreateInput = Prisma.TableSchemaUncheckedCreateInput

export const tableSchemas = [_create({ kn: 'kn', name: 'name' })] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    createdById: users[0].id,
    updatedById: users[0].id,
    data: {},
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ name: `seeded-name-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedTableSchemas(prisma: PrismaClient) {
  const generatedEntities = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...tableSchemas, ...generatedEntities]
  const seedPromises = allSeeds.map((seed) => prisma[entityName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
