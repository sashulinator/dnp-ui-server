import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { Prisma, type NormalizationConfig as PrismaNormalizationConfig, type Process } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import MinioService from '~/shared/minio/service'

import PrismaService from '../../shared/prisma/service'
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
    protected minioService: MinioService,
    protected processService: ProcessService,
  ) {}

  /**
   * ------------ GET FIRST------------
   *
   * Get the first normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaNormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
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

  /**
   * ------------ GET UNIQUE ------------
   *
   * Get the unique normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaNormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
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

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first normalizationConfig that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<PrismaNormalizationConfig | null>} - The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<PrismaNormalizationConfig | null> {
    return this.prisma.normalizationConfig.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<PrismaNormalizationConfig | null>} The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaNormalizationConfig | null> {
    return this.prisma.normalizationConfig.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many normalizationConfigs based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<PrismaNormalizationConfig[]>} A promise containing the normalizationConfigs
   */
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

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many normalizationConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[PrismaNormalizationConfig[], number]>} A promise containing the normalizationConfigs and the total count of the results
   */
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

  /**
   * ------------ CREATE ------------
   *
   * Create a new normalizationConfig
   *
   * @param {CreateInput} createInput The data to create the normalizationConfig with
   * @returns {Promise<PrismaNormalizationConfig>} A promise containing the created normalizationConfig
   * @throws {HttpException} HttpException with status code 409 if the normalizationConfig already exists
   */
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

  /**
   * ------------ UPDATE ------------
   *
   * Update a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} updateNormalizationConfig The data to update the normalizationConfig with
   * @returns {Promise<PrismaNormalizationConfig>} A promise containing the updated normalizationConfig
   */
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

  /**
   * ------------ REMOVE ------------
   *
   * Remove a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<PrismaNormalizationConfig>} A promise containing the removed normalizationConfig
   */
  async remove(where: WhereUniqueInput): Promise<PrismaNormalizationConfig> {
    return this.prisma.normalizationConfig.delete({
      where,
    })
  }

  async run(params: { id: string }): Promise<Process> {
    const normalizationConfig = await this.prisma.normalizationConfig.findUnique({ where: { id: params.id } })
    if (!normalizationConfig) {
      throw new HttpException(`NormalizationConfig with id=${params.id} not found`, HttpStatus.NOT_FOUND)
    }

    // Prepare the filename and buffer for uploading to Minio
    const fileName = `type=normalization&name=${normalizationConfig.name}&id=${normalizationConfig.id}.json`
    const buffer = JSON.stringify(normalizationConfig.data)

    // Upload the normalizationConfig to Minio
    await this.minioService.putObject('dnp-common', fileName, buffer)

    // Set the headers for the HTTP request
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from('airflow:airflow').toString('base64'))
    headers.set('Content-Type', 'application/json;charset=UTF-8')

    // Trigger the Airflow DAG run
    await fetch('http://10.4.40.30:8080/api/v1/dags/dnp_rest_api_trigger/dagRuns', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conf: {
          dnp_s3_config_path: `dnp-common/${fileName}`,
        },
      }),
    })

    return this.processService.create({
      data: {
        initiatorId: normalizationConfig.id,
        id: createId(),
        type: 'normalization',
        tableId: '',
        eventTrackingId: 0,
      },
    })
  }
}
