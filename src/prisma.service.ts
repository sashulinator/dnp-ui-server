import { Injectable, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('Connecting to DB...')
      await this.$connect()
    } catch (e) {
      console.log('Failed to connect to DB. Retrying...')
      setTimeout(() => this.onModuleInit(), 3000)
    }
  }
}
