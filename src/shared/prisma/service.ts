/* eslint-disable no-console */
import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { red } from 'colors'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseDbUrl = require('parse-database-url')

@Injectable()
export default class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      const config = parseDbUrl(process.env.DATABASE_URL)

      console.log('')
      console.log('Connecting to DB...')
      console.log(`    
        Database: ${config.database}
        Host: ${config.host}
        Port: ${config.port}
        Username: ${config.user}

        URL: ${process.env.DATABASE_URL}
      `)
      await this.$connect()
      console.log('Connected to DB.')
      console.log('')
    } catch (e) {
      console.log('')
      console.log(red(`Failed to connect to DB. ${e.message}`))
      console.log('')
      console.log('    Retrying in 3 seconds...')
      setTimeout(() => this.onModuleInit(), 3000)
    }
  }

  async onModuleDestroy() {
    console.log('disconnecting from DB...')
    await this.$disconnect()
    console.log('disconnected from DB.')
  }
}
