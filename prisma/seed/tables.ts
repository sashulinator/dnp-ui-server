import { type Prisma, type PrismaClient } from '@prisma/client'
import { users } from './users'
import { createId } from '@paralleldrive/cuid2'

export const table1 = _create({ kn: 'kn', name: 'name' })

export async function seedTables(prisma: PrismaClient) {
  const seedPromise = prisma.table.create({ data: table1 })

  const seedPromises = Array(20)
    .fill(undefined)
    .map((_, i) => {
      return prisma.table.create({
        data: _create({ name: `${table1.name}-seed-${i}`, kn: `${table1.kn}-seed-${i}` }),
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}

function _create(defaultValues: Partial<Prisma.TableUncheckedCreateInput>): Prisma.TableUncheckedCreateInput {
  const instance: Prisma.TableUncheckedCreateInput = {
    kn: defaultValues.kn ?? createId(),
    name: defaultValues.name ?? createId(),
    createdById: users[0].id,
    updatedById: users[0].id,
    schema: {},
    ...defaultValues,
  }
  return instance
}
