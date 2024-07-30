import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { table1 } from './tables'
import { createId } from '@paralleldrive/cuid2'

const entityName = 'entity'
type CreateInput = Prisma.EntityUncheckedCreateInput

export const entities = [_create({ kn: 'first', name: 'first', nav: true })] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    tableKn: table1.kn,
    nav: false,
    data: { iconName: 'Star' },
    createdById: users[0].id,
    updatedById: users[0].id,
    ...defaultValues,
  }
  return instance
}

function _createOnIteration(_: unknown, i: number): CreateInput {
  return _create({ name: `seeded-name-${i}`, kn: `seeded-kn-${i}` })
}

export default async function seedEntities(prisma: PrismaClient) {
  const generatedEntities = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...entities, ...generatedEntities]
  const seedPromises = allSeeds.map((seed) => prisma[entityName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
