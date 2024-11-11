import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'

import * as v from 'valibot'

import { ValibotPipe } from '~/app/valibot.pipe'

import {
  type CreateBussinessTable,
  type UpdateBussinessTable,
  createBussinessTableSchema,
  updateBussinessTableSchema,
} from './models'
import Service, {
  type BussinessTable,
  type OrderByWithRelationInput,
  type Select,
  type WhereInput,
  type WhereUniqueInput,
} from './nest.service'

@NestJSController('api/v1/dictionary-tables')
export default class BussinessTableController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete an OperationalTable by its KeyName
   *
   * @param {string} kn The KeyName of the operationalTable to delete
   * @returns {Promise<BussinessTable>} A promise that resolves when the operationalTable is deleted
   */
  @Delete(':kn')
  remove(@Param('kn') kn: string): Promise<BussinessTable> {
    return this.service.delete({ where: { kn } })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update an OperationalTable by its KeyName
   *
   * @param {{ input: UpdateBussinessTable }} body The new data for the operationalTable
   * @returns A promise that resolves when the operationalTable is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateBussinessTableSchema })))
  update(@Body() body: { input: UpdateBussinessTable }): Promise<BussinessTable> {
    return this.service.update({ data: { ...body.input, updatedById: 'system' }, where: { kn: body.input.kn } })
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new OperationalTable
   *
   * @param {{ input: CreateBussinessTable }} body - The data for the new operationalTable
   * @returns {Promise<BussinessTable>} A promise that resolves to the created operationalTable
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createBussinessTableSchema })))
  create(@Body() body: { input: CreateBussinessTable }): Promise<BussinessTable> {
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
   * @returns {Promise<BussinessTable>} The found operationalTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no operationalTable is found
   */
  @Get(':kn')
  getByKeyname(@Param('kn') kn: string): Promise<BussinessTable> {
    return this.service.getUnique({ where: { kn } })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first OperationalTable that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<BussinessTable>} A promise that resolves to the found operationalTable
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {},
  ): Promise<BussinessTable> {
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
   * @returns {Promise<{ data: BussinessTable[]; total: number }>} A promise containing the operationalTables and the total count of the results
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
  ): Promise<{ items: BussinessTable[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
