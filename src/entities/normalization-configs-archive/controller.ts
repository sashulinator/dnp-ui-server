import { Body, Get, Controller as NestJSController, Param, Post, Search } from '@nestjs/common'
import { type NormalizationConfig } from '@prisma/client'

import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/normalization-config-archive')
export default class Controller {
  constructor(private readonly service: Service) {}

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
    return this.service.run({ id })
  }

  /**
   * ------------ GET BY ID ------------
   *
   * Get a normalizationConfig by its ID
   *
   * @param {string} id The ID of the normalizationConfig to find
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  @Get(':id')
  getById(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.service.getUnique({ id })
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
    return this.service.findFirst(params)
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
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
