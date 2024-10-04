import { Body, Get, Controller as NestJSController, Param, Post, Search } from '@nestjs/common'
import { createId } from '@paralleldrive/cuid2'
import { type Process as PrismaProcess } from '@prisma/client'

import { type CreateProcess, type Process } from './dto'
import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/processes')
export default class Controller {
  constructor(private readonly service: Service) {}

  @Post()
  /**
   * ------------ CREATE ------------
   *
   * Create a new process
   *
   * @param {CreateProcess} body The data to create the process with
   * @returns {Promise<void>} A promise that resolves when the process is created
   */
  create(@Body() body: CreateProcess): Promise<PrismaProcess> {
    return this.service.create({ data: { ...body, id: createId(), createdById: 'tz4a98xxat96iws9zmbrgj3a' } })
  }

  /**
   * ------------ GET BY ID ------------
   *
   * Get a process by its ID
   *
   * @param {string} id The ID of the process to find
   * @returns {Promise<PrismaProcess>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  @Get(':id')
  getById(@Param('id') id: string): Promise<PrismaProcess> {
    return this.service.getUnique({
      where: { id },
      include: {
        events: true,
      },
    })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first process that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<PrismaProcess>} A promise that resolves to the found process
   */
  @Search('first')
  findFirstOrThrow(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<PrismaProcess> {
    return this.service.getFirst(params)
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
   * @returns {Promise<{ data: PrismaProcess[]; total: number }>} A promise containing the processes and the total count of the results
   */
  @Search()
  async findAndCountMany(
    @Body()
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
      select?: Select
    } = {},
  ): Promise<{ items: Partial<Process>[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items: items as unknown as Partial<Process>[], total }
  }
}
