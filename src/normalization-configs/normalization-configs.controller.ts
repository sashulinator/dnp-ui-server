import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type NormalizationConfig } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/valibot-pipe'

import {
  type CreateNormalizationConfig,
  type UpdateNormalizationConfig,
  createNormalizationConfigSchema,
  updateNormalizationConfigSchema,
} from './normalization-configs.dto'
import {
  type OrderByWithRelationInput,
  type Select,
  Service,
  type WhereInput,
  type WhereUniqueInput,
} from './normalization-configs.service'

@NestJSController('api/v1/normalization-configs')
export class Controller {
  constructor(private readonly normalizationConfigsService: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete a normalizationConfig by its ID
   *
   * @param {string} id The ID of the normalizationConfig to delete
   * @returns {Promise<NormalizationConfig>} A promise that resolves when the normalizationConfig is deleted
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.remove({ id })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a normalizationConfig by its ID
   *
   * @param {{ input: UpdateNormalizationConfig }} body The new data for the normalizationConfig
   * @returns A promise that resolves when the normalizationConfig is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateNormalizationConfigSchema })))
  update(@Body() body: { input: UpdateNormalizationConfig }): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.update({ name: body.input.name }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new normalizationConfig
   *
   * @param {{ input: CreateNormalizationConfig }} body - The data for the new normalizationConfig
   * @returns {Promise<NormalizationConfig>} A promise that resolves to the created normalizationConfig
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createNormalizationConfigSchema })))
  create(@Body() body: { input: CreateNormalizationConfig }): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.create(body.input)
  }

  /**
   * ------------ RUN ------------
   *
   * Run a normalizationConfig by its ID
   *
   * @param {string} id - The ID of the normalizationConfig to run
   * @return {Promise<void>} A promise that resolves when the normalizationConfig is run
   */
  @Post(':id/run')
  run(@Param('id') id: string): Promise<void> {
    return this.normalizationConfigsService.run({ id })
  }

  /**
   * ------------ GET BY ID ------------
   *
   * Get a normalizationConfig by its ID
   *
   * @param {string} name The ID of the normalizationConfig to find
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  @Get(':name')
  getByName(@Param('name') name: string): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.getUnique({ name })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first normalizationConfig that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<NormalizationConfig>} A promise that resolves to the found normalizationConfig
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.findFirst(params)
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
   * @returns {Promise<{ data: NormalizationConfig[]; total: number }>} A promise containing the normalizationConfigs and the total count of the results
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
  ): Promise<{ items: NormalizationConfig[]; total: number }> {
    const [items, total] = await this.normalizationConfigsService.findAndCountMany(params)

    return { items, total }
  }
}
