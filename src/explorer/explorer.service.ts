import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class Service {
  constructor() {}

  async getTables() {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://asavchenko:Orion123@10.4.40.2:5432/dnp_dev_1?schema=public`,
        },
      },
    })

    return prisma.$queryRaw`SELECT tablename, schemaname FROM pg_tables WHERE schemaname = 'public';`
  }
}
