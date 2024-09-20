import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient } from '@prisma/client'

import { users } from './users'

const processes1: Prisma.ProcessUncheckedCreateInput = {
  id: 'tz4a98xxat96iws9zmbrgj3a',
  createdById: users[0].id,
  type: 'import',
  data: '',
}

export async function seedProcesses(prisma: PrismaClient) {
  const seedPromise = prisma.process.create({
    data: processes1,
  })

  const seedPromises = Array(20)
    .fill(undefined)
    .map(() => {
      return prisma.process.create({
        data: { ...processes1, id: createId() },
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}
