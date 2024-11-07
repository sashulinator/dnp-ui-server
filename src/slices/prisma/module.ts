import { Module } from '@nestjs/common'

import Service from './service'

@Module({
  providers: [Service],
  exports: [Service],
})
export default class PrismaModule {}
