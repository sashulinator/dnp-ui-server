import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { type NormalizationConfig, Prisma } from '@prisma/client'

import { MinioService } from 'src/minio.service'
import { isInstanceOf } from 'utils/core'

import { PrismaService } from '../prisma.service'
import { type CreateNormalizationConfig, type UpdateNormalizationConfig } from './normalization-configs.dto'

export type WhereUniqueInput = Prisma.NormalizationConfigWhereUniqueInput
export type WhereInput = Prisma.NormalizationConfigWhereInput
export type OrderByWithRelationInput = Prisma.NormalizationConfigOrderByWithRelationInput
export type Select = Prisma.NormalizationConfigSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { updatedAt: 'desc' }

@Injectable()
export class Service {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService
  ) {}

  /**
   * ------------ GET FIRST------------
   *
   * Get the first normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig> {
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
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  async getUnique(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig> {
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
   * @returns {Promise<NormalizationConfig | null>} - The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<NormalizationConfig | null> {
    return this.prisma.normalizationConfig.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique normalizationConfig that matches the given `whereUniqueInput`.
   * If no normalizationConfig is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<NormalizationConfig | null>} The found normalizationConfig or `null` if no normalizationConfig is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<NormalizationConfig | null> {
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
   * @returns {Promise<NormalizationConfig[]>} A promise containing the normalizationConfigs
   */
  async findMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {}
  ): Promise<NormalizationConfig[]> {
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
   * @returns {Promise<[NormalizationConfig[], number]>} A promise containing the normalizationConfigs and the total count of the results
   */
  async findAndCountMany(
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {}
  ): Promise<[NormalizationConfig[], number]> {
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
   * @returns {Promise<NormalizationConfig>} A promise containing the created normalizationConfig
   * @throws {HttpException} HttpException with status code 409 if the normalizationConfig already exists
   */
  async create(createInput: CreateNormalizationConfig): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.create({
      data: {
        ...createInput,
        createdBy: '3422b448-2460-4fd2-9183-8000de6f8343',
        updatedBy: '3422b448-2460-4fd2-9183-8000de6f8343',
      },
    })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @param {UpdateInput} data The data to update the normalizationConfig with
   * @returns {Promise<NormalizationConfig>} A promise containing the updated normalizationConfig
   */
  async update(where: WhereUniqueInput, data: UpdateNormalizationConfig): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.update({
      data,
      where,
    })
  }

  /**
   * ------------ REMOVE ------------
   *
   * Remove a normalizationConfig
   *
   * @param {WhereUniqueInput} where A WHERE clause for the query
   * @returns {Promise<NormalizationConfig>} A promise containing the removed normalizationConfig
   */
  async remove(where: WhereUniqueInput): Promise<NormalizationConfig> {
    return this.prisma.normalizationConfig.delete({
      where,
    })
  }

  /**
   * ------------ RUN ------------
   *
   * Run a normalizationConfig. This involves uploading the config to minio and triggering a
   * dag run in airflow
   *
   * @param {object} props The props for the run function
   * @param {string} props.id The id of the normalizationConfig to run
   * @returns {Promise<void>} A promise that resolves when the normalizationConfig has been run
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(props: { id: string }): Promise<any> {
    // Get the normalizationConfig from the database
    const normalizationConfig = await this.getUnique({ id: props.id })

    // Upload the normalizationConfig to minio
    const fileName = `${normalizationConfig.name}.json`
    const buffer = JSON.stringify(normalizationConfig.data)

    await this.minio.putObject('dnp-common', fileName, buffer)

    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from('airflow:airflow').toString('base64'))
    headers.set('Content-Type', 'application/json;charset=UTF-8')

    // Trigger airflow dag run
    const response = await fetch('http://10.4.40.30:8080/api/v1/dags/dnp_rest_api_trigger/dagRuns', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        conf: {
          dnp_s3_config_path: `dnp-common/${fileName}`,
        },
      }),
    })

    return response.json()
  }
}
