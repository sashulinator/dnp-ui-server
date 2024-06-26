import { Module } from '@nestjs/common'
import Service from './prisma.service'

@Module({
  providers: [Service],
  exports: [Service], // 👈 export PrismaService for DI
})
export default class PrismaModule {}
