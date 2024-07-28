import { Module } from '@nestjs/common'

import Service from './service'
import PrismaModule from '../../shared/prisma/module'

@Module({
  providers: [Service],
  imports: [PrismaModule],
  exports: [Service],
})
export default class ExplorerModule {}
