import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export default class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      // eslint-disable-next-line no-console
      console.log('Connecting to DB...')
      await this.$connect()
      // eslint-disable-next-line no-console
      console.log('Connected to DB.')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Failed to connect to DB. Retrying in 3 seconds...')
      setTimeout(() => this.onModuleInit(), 3000)
    }
  }

  async onModuleDestroy() {
    // eslint-disable-next-line no-console
    console.log('disconnecting from DB...')
    await this.$disconnect()
    // eslint-disable-next-line no-console
    console.log('disconnected from DB.')
  }
}
