import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search } from '@nestjs/common'
import { type Translation } from '@prisma/client'
import Service, {
  type CreateInput,
  type OrderByWithRelationInput,
  type UpdateInput,
  type WhereInput,
  type WhereUniqueInput,
} from './service'

@NestJSController('api/v1/translations')
export class Controller {
  constructor(private readonly service: Service) {}

  @Delete(':id')
  /**
   * Delete a translation by its ID
   *
   * @param {string} id The ID of the translation to delete
   * @returns {Promise<Translation>} A promise that resolves when the translation is deleted
   */
  remove(@Param('id') id: number): Promise<Translation> {
    return this.service.remove({ id })
  }

  @Put(':id')
  /**
   * Update a translation by its ID
   *
   * @param {string} id The ID of the translation to update
   * @param {UpdateInput} updateInput The new data for the translation
   * @returns A promise that resolves when the translation is updated
   */
  update(@Param('id') id: string, @Body() updateInput: UpdateInput): Promise<Translation> {
    return this.service.update(
      { id: Number(id) }, // The unique identifier of the translation to update
      updateInput // The new data for the translation
    )
  }

  @Post()
  create(@Body() createInput: CreateInput) {
    return this.service.create(createInput)
  }

  @Get(':id')
  /**
   * Find a translation by its ID
   *
   * @param {string} id The ID of the translation to find
   * @returns {Promise<Translation>} The found translation
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no translation is found
   */
  getById(@Param('id') id: string): Promise<Translation> {
    return this.service.getUniq({ id: Number(id) })
  }

  @Search()
  /**
   * Find many translations and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: Translation[]; total: number }>} A promise containing the translations and the total count of the results
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
  ): Promise<{ items: Translation[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
