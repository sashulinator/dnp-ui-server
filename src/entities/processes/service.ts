import { Injectable } from '@nestjs/common'
import { type Prisma, type Process as PrismaProcess } from '@prisma/client'

import { CrudDelegator } from '~/shared/crud'

import PrismaService from '../../shared/prisma/service'

export type Process = PrismaProcess
export type CreateProcess = Prisma.ProcessUncheckedCreateInput
export type UpdateProcess = Prisma.ProcessUncheckedUpdateInput

export type WhereUniqueInput = Prisma.ProcessWhereUniqueInput
export type WhereInput = Prisma.ProcessWhereInput
export type Include = Prisma.ProcessInclude
export type OrderByWithRelationInput = Prisma.ProcessOrderByWithRelationInput
export type Select = Prisma.ProcessSelect

@Injectable()
export default class Service extends CrudDelegator<Process, CreateProcess, UpdateProcess> {
  constructor(protected prisma: PrismaService) {
    const include: Include = { createdBy: true }
    const orderBy: OrderByWithRelationInput = { createdAt: 'desc' }

    super(
      {
        take: 100,
        orderBy,
        include,
      },
      {
        count: prisma.process.count.bind(prisma),
        create: prisma.process.create.bind(prisma),
        delete: CrudDelegator.notAllowed,
        update: CrudDelegator.notAllowed,
        getFirst: prisma.process.findFirstOrThrow.bind(prisma),
        getUnique: prisma.process.findUniqueOrThrow.bind(prisma),
        findFirst: prisma.process.findFirst.bind(prisma),
        findMany: prisma.process.findMany.bind(prisma),
        findUnique: prisma.process.findUnique.bind(prisma),
        transaction: prisma.$transaction.bind(prisma),
      },
    )
  }

  async createWithRuntimeConfig(params: { data: CreateProcess; select?: Select; include?: Include }): Promise<Process> {
    return super.create(params)
  }
}
