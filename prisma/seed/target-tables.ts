import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import tables from './table-schemas'
import { createId } from '@paralleldrive/cuid2'

const targetTableName = 'targetTable'
type CreateInput = Prisma.TargetTableUncheckedCreateInput

export const targetTables = [_create({ kn: 'first', name: 'first', nav: true })] as const

function _create(defaultValues: Partial<CreateInput>): CreateInput {
  const instance: CreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    tableSchemaKn: tables[0].kn,
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

export default async function seedtargetTables(prisma: PrismaClient) {
  const generatedtargetTables = Array(20).fill(35).map(_createOnIteration)
  const allSeeds = [...targetTables, ...generatedtargetTables]
  const seedPromises = allSeeds.map((seed) => prisma[targetTableName].create({ data: seed }))
  return Promise.all([...seedPromises])
}
