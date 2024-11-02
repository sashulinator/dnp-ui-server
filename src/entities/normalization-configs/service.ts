import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { Prisma, type NormalizationConfig as PrismaNormalizationConfig, type Process } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '~/shared/prisma/service'
import { EngineService } from '~/slices/engine'
import { assertObject } from '~/utils/assertions/object'

import ProcessService from '../processes/service'
import { type BaseNormalizationConfig, type CreateNormalizationConfig, type UpdateNormalizationConfig } from './dto'

export type WhereUniqueInput = Prisma.NormalizationConfigWhereUniqueInput
export type WhereInput = Prisma.NormalizationConfigWhereInput
export type OrderByWithRelationInput = Prisma.NormalizationConfigOrderByWithRelationInput
export type Select = Prisma.NormalizationConfigSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export default class Service {
  constructor(
    private prisma: PrismaService,
    private engineService: EngineService,
    protected processService: ProcessService,
  ) {}

  async getFirst(whereUniqInput: WhereInput): Promise<PrismaNormalizationConfig> {
    return this.prisma.normalizationConfig
      .findFirstOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaNormalizationConfig> {
    return this.prisma.normalizationConfig
      .findUniqueOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<PrismaNormalizationConfig | null> {
    return this.prisma.normalizationConfig.findFirst(params)
  }

  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaNormalizationConfig | null> {
    return this.prisma.normalizationConfig.findUnique({
      where: whereUniqInput,
    })
  }

  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {},
  ): Promise<PrismaNormalizationConfig[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.normalizationConfig.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {},
  ): Promise<[PrismaNormalizationConfig[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.normalizationConfig.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.normalizationConfig.count(commonArgs),
    ])
  }

  async create(createInput: CreateNormalizationConfig): Promise<PrismaNormalizationConfig> {
    const item = await this.prisma.normalizationConfig.findFirst({ where: { name: createInput.name, last: true } })

    if (item) {
      throw new HttpException(`NormalizationConfig with name "${createInput.name}" already exists`, HttpStatus.CONFLICT)
    }

    return this.prisma.normalizationConfig.create({
      data: {
        ...createInput,
        v: 1,
        id: createId(),
        createdById: 'system',
        updatedById: 'system',
      },
    })
  }

  async update(
    where: WhereInput,
    updateNormalizationConfig: UpdateNormalizationConfig,
  ): Promise<PrismaNormalizationConfig> {
    const prismaItem = await this.getFirst(where)

    const processes = await this.prisma.process.findFirst({ where: { initiatorId: prismaItem.id } })

    // Если нет процессов, то просто обновляем данные
    if (!processes) {
      return this.prisma.normalizationConfig.update({ where: { id: prismaItem.id }, data: updateNormalizationConfig })
    }

    // Если есть процессы, то создаем архивную версию

    // Необходимо Date поля привести к string, самый простой способ
    const itemToArchive = JSON.parse(JSON.stringify(prismaItem)) as BaseNormalizationConfig

    if (!itemToArchive.last) {
      throw new HttpException('Редактирование архивной версии недоступно', HttpStatus.BAD_REQUEST)
    }

    const [, created] = await this.prisma.$transaction([
      this.prisma.normalizationConfig.update({
        where: { id: itemToArchive.id },
        data: { ...itemToArchive, last: false },
      }),
      this.prisma.normalizationConfig.create({
        data: {
          ...updateNormalizationConfig,
          name: itemToArchive.name,
          id: createId(),
          v: itemToArchive.v + 1,
          createdById: 'tz4a98xxat96iws9zmbrgj3a',
          updatedById: 'tz4a98xxat96iws9zmbrgj3a',
          last: true,
        },
      }),
    ])

    return created
  }

  async remove(where: WhereUniqueInput): Promise<PrismaNormalizationConfig> {
    return this.prisma.normalizationConfig.delete({
      where,
    })
  }

  async run(params: { id: string }): Promise<{ process: Process }> {
    const normalizationConfig = await this.prisma.normalizationConfig.findUniqueOrThrow({ where: { id: params.id } })

    const data = normalizationConfig.data
    // TODO: Выкинуть кастомную ошибку
    assertObject(data)

    await this.engineService.normalize({
      id: normalizationConfig.id,
      name: normalizationConfig.name,
      data,
    })

    const createdProcess = await this.processService.create({
      data: {
        initiatorId: normalizationConfig.id,
        id: createId(),
        type: 'normalization',
        tableId: '',
        eventTrackingId: 0,
      },
    })

    return { process: createdProcess }
  }
}
