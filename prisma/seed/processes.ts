import { createId } from '@paralleldrive/cuid2'
import { type Prisma, type PrismaClient, ProcessType } from '@prisma/client'

import { users } from './users'

const processes1: Prisma.ProcessUncheckedCreateInput = {
  id: 'tz4a98xxat96iws9zmbrgj3a',
  type: ProcessType.IMPORT,
  tableId: 'cars',
  eventTrackingId: 0,
  runtimeConfigData: '',
  createdById: users[0].id,
}

export async function seedProcesses(prisma: PrismaClient) {
  const seedPromise = prisma.process.create({
    data: processes1,
  })

  const seedPromises = Array(20)
    .fill(undefined)
    .map((_, i) => {
      return prisma.process.create({
        data: { ...processes1, eventTrackingId: i + 1, id: createId() },
      })
    })

  return Promise.all([...seedPromises, seedPromise])
}
