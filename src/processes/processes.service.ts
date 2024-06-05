import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
// import { createId } from '@paralleldrive/cuid2'
import { Prisma, type Process as PrismaProcess } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import { MinioService } from '~/minio.service'

import { PrismaService } from '../prisma.service'
import { type CreateProcess } from './processes.dto'

export type WhereUniqueInput = Prisma.ProcessWhereUniqueInput
export type WhereInput = Prisma.ProcessWhereInput
export type OrderByWithRelationInput = Prisma.ProcessOrderByWithRelationInput
export type Select = Prisma.ProcessSelect

const TAKE = 100
const ORDER_BY: OrderByWithRelationInput = { createdAt: 'desc' }

@Injectable()
export class Service {
  constructor(
    private prisma: PrismaService,
    private minio: MinioService
  ) {}

  /**
   * ------------ GET FIRST------------
   *
   * Get the first process that matches the given `whereUniqueInput`.
   * If no process is found, throw a `HttpException` with status `NOT_FOUND`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Process>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  async getFirst(whereUniqInput: WhereUniqueInput): Promise<PrismaProcess> {
    return this.prisma.process
      .findFirstOrThrow({
        where: whereUniqInput,
      })
      .catch((error) => {
        if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
      })
  }

  async getUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaProcess> {
    return this.prisma.process
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
   * Find the first process that matches the given `whereInput`
   *
   * @param {Object} params - The parameters for the query
   * @param {WhereInput} params.where - A WHERE clause for the query
   * @param {Select} params.select - A SELECT clause for the query
   * @returns {Promise<Process | null>} - The found process or `null` if no process is found
   */
  async findFirst(
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<PrismaProcess | null> {
    return this.prisma.process.findFirst(params)
  }

  /**
   * ------------ FIND UNIQUE ------------
   *
   * Find the unique process that matches the given `whereUniqueInput`.
   * If no process is found, return `null`.
   *
   * @param {WhereUniqueInput} whereUniqInput The `whereUniqueInput` to match
   * @returns {Promise<Process | null>} The found process or `null` if no process is found
   */
  async findUnique(whereUniqInput: WhereUniqueInput): Promise<PrismaProcess | null> {
    return this.prisma.process.findUnique({
      where: whereUniqInput,
    })
  }

  /**
   * ------------ FIND MANY ------------
   *
   * Find many processes based on the given query parameters
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<Process[]>} A promise containing the processes
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
  ): Promise<PrismaProcess[]> {
    const { skip, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    return this.prisma.process.findMany({
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
   * Find many processes and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<[Process[], number]>} A promise containing the processes and the total count of the results
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
  ): Promise<[PrismaProcess[], number]> {
    const { skip, select, take = TAKE, cursor, where, orderBy = ORDER_BY } = params

    const commonArgs = {
      cursor,
      where,
      orderBy,
    }

    return this.prisma.$transaction([
      this.prisma.process.findMany({ ...commonArgs, take, skip, select }),
      this.prisma.process.count(commonArgs),
    ])
  }

  async create(props: CreateProcess): Promise<PrismaProcess> {
    // Retrieve the normalizationConfig from the database
    const normalizationConfig = await this.prisma.normalizationConfig.findUnique({
      where: { id: props.normalizationConfigId },
    })

    // Throw an error if the normalizationConfig is not found
    if (!normalizationConfig) {
      throw new HttpException(
        `NormalizationConfig with id=${props.normalizationConfigId} not found`,
        HttpStatus.NOT_FOUND
      )
    }

    // Prepare the filename and buffer for uploading to Minio
    const fileName = `${normalizationConfig.name}.json`
    const buffer = JSON.stringify(normalizationConfig.data)

    // Upload the normalizationConfig to Minio
    await this.minio.putObject('dnp-common', fileName, buffer)

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

    return this.prisma.process.create({
      data: {
        normalizationConfigId: props.normalizationConfigId,
        id: createId(),
        createdBy: 'tz4a98xxat96iws9zmbrgj3a',
      },
    })
  }
}
