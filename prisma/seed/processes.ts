import { type PrismaClient } from '@prisma/client'

export async function seedProcesses(prisma: PrismaClient) {
  await prisma.process.create({
    data: {
      id: 'tz4a98xxat96iws9zmbrgj3a',
      createdBy: 'tz4a98xxat96iws9zmbrgj3a',
      normalizationConfigId: 'tz4a98xxat96iws9zmbrgj3a',
    },
  })
}
