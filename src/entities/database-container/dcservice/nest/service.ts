import { Injectable } from '@nestjs/common'

import knex from 'knex'

import { PrismaService } from '~/slices/prisma'

import { _Crud } from './_crud'

export type * from './_crud'

export type TestConnectionParams = {
  client: 'pg'
  user: string
  password: string
  host: string
  port: number
}

@Injectable()
export class DcserviceService extends _Crud {
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }

  async testConnection(params: TestConnectionParams) {
    const kx = knex({
      client: params.client,
      connection: {
        host: params.host,
        port: params.port,
        user: params.user,
        password: params.password,
        database: 'postgres',
      },
    })

    const ret = await kx.raw(`
      SELECT datname
      FROM pg_database
      LIMIT 1
    `)

    return !!ret
  }
}
