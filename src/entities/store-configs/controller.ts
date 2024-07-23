import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type StoreConfig } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/shared/valibot.pipe'

import { type CreateStoreConfig, type UpdateStoreConfig, createStoreConfigSchema, updateStoreConfigSchema } from './dto'
import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/store-configs')
export default class Controller {
  constructor(private readonly service: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete a StoreConfig by its KeyName
   *
   * @param {string} keyname The KeyName of the storeConfig to delete
   * @returns {Promise<StoreConfig>} A promise that resolves when the storeConfig is deleted
   */
  @Delete(':keyname')
  remove(@Param('keyname') keyname: string): Promise<StoreConfig> {
    return this.service.remove({ keyname })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a StoreConfig by its KeyName
   *
   * @param {{ input: UpdateStoreConfig }} body The new data for the storeConfig
   * @returns A promise that resolves when the storeConfig is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateStoreConfigSchema })))
  update(@Body() body: { input: UpdateStoreConfig }): Promise<StoreConfig> {
    return this.service.update({ keyname: body.input.keyname }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new StoreConfig
   *
   * @param {{ input: CreateStoreConfig }} body - The data for the new storeConfig
   * @returns {Promise<StoreConfig>} A promise that resolves to the created storeConfig
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createStoreConfigSchema })))
  create(@Body() body: { input: CreateStoreConfig }): Promise<StoreConfig> {
    return this.service.create(body.input)
  }

  /**
   * ------------ GET BY KEYNAME ------------
   *
   * Get a StoreConfig by its KeyName
   *
   * @param {string} keyname The KeyName of the storeConfig to find
   * @returns {Promise<StoreConfig>} The found storeConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no storeConfig is found
   */
  @Get(':keyname')
  getByName(@Param('keyname') keyname: string): Promise<StoreConfig> {
    return this.service.getUnique({ keyname })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first StoreConfig that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<StoreConfig>} A promise that resolves to the found storeConfig
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<StoreConfig> {
    return this.service.findFirst(params)
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many StoreConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: StoreConfig[]; total: number }>} A promise containing the storeConfigs and the total count of the results
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
  ): Promise<{ items: StoreConfig[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
