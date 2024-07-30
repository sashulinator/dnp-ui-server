import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type Entity } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/shared/valibot.pipe'

import { type CreateEntity, type UpdateEntity, createEntitySchema, updateEntitySchema } from './dto'
import Service, { type OrderByWithRelationInput, type Select, type WhereInput, type WhereUniqueInput } from './service'

@NestJSController('api/v1/entities')
export default class EntityController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete an Entity by its KeyName
   *
   * @param {string} kn The KeyName of the entity to delete
   * @returns {Promise<Entity>} A promise that resolves when the entity is deleted
   */
  @Delete(':kn')
  remove(@Param('kn') kn: string): Promise<Entity> {
    return this.service.remove({ kn })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update an Entity by its KeyName
   *
   * @param {{ input: UpdateEntity }} body The new data for the entity
   * @returns A promise that resolves when the entity is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateEntitySchema })))
  update(@Body() body: { input: UpdateEntity }): Promise<Entity> {
    return this.service.update({ kn: body.input.kn }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new Entity
   *
   * @param {{ input: CreateEntity }} body - The data for the new entity
   * @returns {Promise<Entity>} A promise that resolves to the created entity
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createEntitySchema })))
  create(@Body() body: { input: CreateEntity }): Promise<Entity> {
    return this.service.create(body.input)
  }

  /**
   * ------------ GET BY KEYNAME ------------
   *
   * Get an Entity by its KeyName
   *
   * @param {string} kn The KeyName of the entity to find
   * @returns {Promise<Entity>} The found entity
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no entity is found
   */
  @Get(':kn')
  getByKeyname(@Param('kn') kn: string): Promise<Entity> {
    return this.service.getUnique({ kn })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first Entity that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<Entity>} A promise that resolves to the found entity
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<Entity> {
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
   * @returns {Promise<{ data: Entity[]; total: number }>} A promise containing the entitys and the total count of the results
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
  ): Promise<{ items: Entity[]; total: number }> {
    const [items, total] = await this.service.findAndCountMany(params)

    return { items, total }
  }
}
