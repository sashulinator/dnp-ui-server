import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'

import * as v from 'valibot'

import { ValibotPipe } from '~/app/valibot.pipe'

import { type CreateTargetTable, type UpdateTargetTable, createTargetTableSchema, updateTargetTableSchema } from './dto'
import Service, {
  type OrderByWithRelationInput,
  type Select,
  type TargetTable,
  type WhereInput,
  type WhereUniqueInput,
} from './service'

@NestJSController('api/v1/target-tables')
export default class TargetTableController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete an OperationalTable by its KeyName
   *
   * @param {string} kn The KeyName of the operationalTable to delete
   * @returns {Promise<TargetTable>} A promise that resolves when the operationalTable is deleted
   */
  @Delete(':kn')
  remove(@Param('kn') kn: string): Promise<TargetTable> {
    return this.service.delete({ where: { kn } })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update an OperationalTable by its KeyName
   *
   * @param {{ input: UpdateTargetTable }} body The new data for the operationalTable
   * @returns A promise that resolves when the operationalTable is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateTargetTableSchema })))
  update(@Body() body: { input: UpdateTargetTable }): Promise<TargetTable> {
    return this.service.update({ data: { ...body.input, updatedById: 'system' }, where: { kn: body.input.kn } })
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new OperationalTable
   *
   * @param {{ input: CreateTargetTable }} body - The data for the new operationalTable
   * @returns {Promise<TargetTable>} A promise that resolves to the created operationalTable
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createTargetTableSchema })))
  create(@Body() body: { input: CreateTargetTable }): Promise<TargetTable> {
    return this.service.create({
      data: { ...body.input, createdById: 'system', updatedById: 'system' },
    })
  }

  /**
   * ------------ GET BY KEYNAME ------------
   *
   * Get an OperationalTable by its KeyName
   *
   * @param {string} kn The KeyName of the operationalTable to find
   * @returns {Promise<TargetTable>} The found operationalTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no operationalTable is found
   */
  @Get(':kn')
  getByKeyname(@Param('kn') kn: string): Promise<TargetTable> {
    return this.service.getUnique({ where: { kn } })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first OperationalTable that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<TargetTable>} A promise that resolves to the found operationalTable
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<TargetTable> {
    return this.service.findFirst(params)
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many Entities and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: TargetTable[]; total: number }>} A promise containing the operationalTables and the total count of the results
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
  ): Promise<{ items: TargetTable[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
