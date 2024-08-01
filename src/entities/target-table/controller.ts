import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type TargetTable } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/shared/valibot.pipe'

import { type CreateTargetTable, type UpdateTargetTable, createTargetTableSchema, updateTargetTableSchema } from './dto'
import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/entities')
export default class TargetTableController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete an TargetTable by its KeyName
   *
   * @param {string} kn The KeyName of the targetTable to delete
   * @returns {Promise<TargetTable>} A promise that resolves when the targetTable is deleted
   */
  @Delete(':kn')
  remove(@Param('kn') kn: string): Promise<TargetTable> {
    return this.service.remove({ kn })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update an TargetTable by its KeyName
   *
   * @param {{ input: UpdateTargetTable }} body The new data for the targetTable
   * @returns A promise that resolves when the targetTable is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateTargetTableSchema })))
  update(@Body() body: { input: UpdateTargetTable }): Promise<TargetTable> {
    return this.service.update({ kn: body.input.kn }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new TargetTable
   *
   * @param {{ input: CreateTargetTable }} body - The data for the new targetTable
   * @returns {Promise<TargetTable>} A promise that resolves to the created targetTable
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createTargetTableSchema })))
  create(@Body() body: { input: CreateTargetTable }): Promise<TargetTable> {
    return this.service.create(body.input)
  }

  /**
   * ------------ GET BY KEYNAME ------------
   *
   * Get an TargetTable by its KeyName
   *
   * @param {string} kn The KeyName of the targetTable to find
   * @returns {Promise<TargetTable>} The found targetTable
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no targetTable is found
   */
  @Get(':kn')
  getByKeyname(@Param('kn') kn: string): Promise<TargetTable> {
    return this.service.getUnique({ kn })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first TargetTable that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<TargetTable>} A promise that resolves to the found targetTable
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
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
   * @returns {Promise<{ data: TargetTable[]; total: number }>} A promise containing the targetTables and the total count of the results
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
    } = {}
  ): Promise<{ items: TargetTable[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
