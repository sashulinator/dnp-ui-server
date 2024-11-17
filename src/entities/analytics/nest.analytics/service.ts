import { Injectable } from '@nestjs/common'
import type { AnalyticalActions } from '@prisma/client'

import { PrismaService } from '~/slices/prisma'

export { type AnalyticalActions }

export type RunParams = {
  services: {
    host: string
    port: number
    username: string
    password: string
    databases: {
      name: string
      schemas: {
        name: string
        tables: {
          name: string
          columns: {
            name: string
            actions: string[]
          }[]
        }[]
      }[]
    }[]
  }[]
}

@Injectable()
export class AnalyticsService {
  constructor(protected prisma: PrismaService) {}
  run(params: RunParams) {
    params
  }
}
