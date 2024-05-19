import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search } from '@nestjs/common'
import { NormalizationConfig } from '@prisma/client'

import {
  CreateInput,
  OrderByWithRelationInput,
  Service,
  UpdateInput,
  WhereInput,
  WhereUniqueInput,
} from './normalization-configs.service'

@NestJSController('api/v1/normalization-configs')
export class Controller {
  constructor(private readonly normalizationConfigsService: Service) {}

  @Delete(':id')
  /**
   * Delete a normalizationConfig by its ID
   *
   * @param {string} id The ID of the normalizationConfig to delete
   * @returns {Promise<NormalizationConfig>} A promise that resolves when the normalizationConfig is deleted
   */
  remove(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.remove({ id })
  }

  @Put(':id')
  /**
   * Update a normalizationConfig by its ID
   *
   * @param {string} id The ID of the normalizationConfig to update
   * @param {UpdateInput} updateInput The new data for the normalizationConfig
   * @returns A promise that resolves when the normalizationConfig is updated
   */
  update(@Param('id') id: string, @Body() body: { input: UpdateInput }): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.update(
      { id }, // The unique identifier of the normalizationConfig to update
      body.input // The new data for the normalizationConfig
    )
  }

  @Post()
  create(@Body() body: { input: CreateInput }) {
    return this.normalizationConfigsService.create(body.input)
  }

  @Get(':id')
  /**
   * Find a normalizationConfig by its ID
   *
   * @param {string} id The ID of the normalizationConfig to find
   * @returns {Promise<NormalizationConfig>} The found normalizationConfig
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no normalizationConfig is found
   */
  getById(@Param('id') id: string): Promise<NormalizationConfig> {
    return this.normalizationConfigsService.getUniq({ id })
  }

  @Search()
  /**
   * Find many normalizationConfigs and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: NormalizationConfig[]; total: number }>} A promise containing the normalizationConfigs and the total count of the results
   */
  async findAndCountMany(
    @Body()
    params: {
      skip?: number
      take?: number
      cursor?: WhereUniqueInput
      where?: WhereInput
      orderBy?: OrderByWithRelationInput
    } = {}
  ): Promise<{ items: NormalizationConfig[]; total: number }> {
    const [items, total] = await this.normalizationConfigsService.findAndCountMany(params)

    return { items, total }
  }
}
