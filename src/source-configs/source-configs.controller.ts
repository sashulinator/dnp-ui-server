import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type SourceConfig } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/valibot-pipe'

import {
  type CreateSourceConfig,
  type UpdateSourceConfig,
  createSourceConfigSchema,
  updateSourceConfigSchema,
} from './source-configs.dto'
import {
  type OrderByWithRelationInput,
  type Select,
  Service,
  type WhereInput,
  type WhereUniqueInput,
} from './source-configs.service'

@NestJSController('api/v1/source-configs')
export class Controller {
  constructor(private readonly sourceConfigsService: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete a SourceConfig by its KeyName
   *
   * @param {string} keyName The KeyName of the sourceConfig to delete
   * @returns {Promise<SourceConfig>} A promise that resolves when the sourceConfig is deleted
   */
  @Delete(':keyName')
  remove(@Param('keyName') keyName: string): Promise<SourceConfig> {
    return this.sourceConfigsService.remove({ keyName })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a SourceConfig by its KeyName
   *
   * @param {{ input: UpdateSourceConfig }} body The new data for the sourceConfig
   * @returns A promise that resolves when the sourceConfig is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateSourceConfigSchema })))
  update(@Body() body: { input: UpdateSourceConfig }): Promise<SourceConfig> {
    return this.sourceConfigsService.update({ keyName: body.input.keyName }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new SourceConfig
   *
   * @param {{ input: CreateSourceConfig }} body - The data for the new sourceConfig
   * @returns {Promise<SourceConfig>} A promise that resolves to the created sourceConfig
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createSourceConfigSchema })))
  create(@Body() body: { input: CreateSourceConfig }): Promise<SourceConfig> {
    return this.sourceConfigsService.create(body.input)
  }

  /**
   * ------------ GET BY KEYNAME ------------
   *
   * Get a SourceConfig by its KeyName
   *
   * @param {string} keyName The KeyName of the sourceConfig to find
   * @returns {Promise<SourceConfig>} The found sourceConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no sourceConfig is found
   */
  @Get(':keyName')
  getByName(@Param('keyName') keyName: string): Promise<SourceConfig> {
    return this.sourceConfigsService.getUnique({ keyName })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first SourceConfig that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<SourceConfig>} A promise that resolves to the found sourceConfig
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<SourceConfig> {
    return this.sourceConfigsService.findFirst(params)
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many SourceConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: SourceConfig[]; total: number }>} A promise containing the sourceConfigs and the total count of the results
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
  ): Promise<{ items: SourceConfig[]; total: number }> {
    const [items, total] = await this.sourceConfigsService.findAndCountMany(params)

    return { items, total }
  }
}
