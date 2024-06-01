import { Body, Delete, Get, Controller as NestJSController, Param, Post, Put, Search, UsePipes } from '@nestjs/common'
import { type Process } from '@prisma/client'

import * as v from 'valibot'

import { ValibotPipe } from '~/valibot-pipe'

import { type CreateProcess, type UpdateProcess, createProcessSchema, updateProcessSchema } from './processes.dto'
import {
  type OrderByWithRelationInput,
  type Select,
  Service,
  type WhereInput,
  type WhereUniqueInput,
} from './processes.service'

@NestJSController('api/v1/processes')
export class Controller {
  constructor(private readonly processesService: Service) {}

  /**
   * ------------ DELETE ------------
   *
   * Delete a process by its ID
   *
   * @param {string} id The ID of the process to delete
   * @returns {Promise<Process>} A promise that resolves when the process is deleted
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Process> {
    return this.processesService.remove({ id })
  }

  /**
   * ------------ UPDATE ------------
   *
   * Update a process by its ID
   *
   * @param {{ input: UpdateProcess }} body The new data for the process
   * @returns A promise that resolves when the process is updated
   */
  @Put()
  @UsePipes(new ValibotPipe(v.object({ input: updateProcessSchema })))
  update(@Body() body: { input: UpdateProcess }): Promise<Process> {
    return this.processesService.update({ id: body.input.id }, body.input)
  }

  /**
   * ------------ CREATE ------------
   *
   * Create a new process
   *
   * @param {{ input: CreateProcess }} body - The data for the new process
   * @returns {Promise<Process>} A promise that resolves to the created process
   */
  @Post()
  @UsePipes(new ValibotPipe(v.object({ input: createProcessSchema })))
  create(@Body() body: { input: CreateProcess }): Promise<Process> {
    return this.processesService.create(body.input)
  }

  /**
   * ------------ GET BY ID ------------
   *
   * Get a process by its ID
   *
   * @param {string} id The ID of the process to find
   * @returns {Promise<Process>} The found process
   * @throws {HttpException} `HttpException` with status `NOT_FOUND` if no process is found
   */
  @Get(':id')
  getById(@Param('id') id: string): Promise<Process> {
    return this.processesService.getUnique({ id })
  }

  /**
   * ------------ FIND FIRST ------------
   *
   * Find the first process that matches the given query parameters
   *
   * @param {{ where?: WhereInput; select?: Select }} params - The query parameters
   * @returns {Promise<Process>} A promise that resolves to the found process
   */
  @Search('first')
  findFirst(
    @Body()
    params: {
      where?: WhereInput
      select?: Select
    } = {}
  ): Promise<Process> {
    return this.processesService.findFirst(params)
  }

  /**
   * ------------ FIND AND COUNT MANY ------------
   *
   * Find many processes and return the total count of the results
   *
   * @param {number} params.skip The number of results to skip
   * @param {number} params.take The number of results to return
   * @param {WhereUniqueInput} params.cursor The cursor to start from
   * @param {WhereInput} params.where A WHERE clause for the query
   * @param {OrderByWithRelationInput} params.orderBy An ORDER BY clause for the query
   * @returns {Promise<{ data: Process[]; total: number }>} A promise containing the processes and the total count of the results
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
  ): Promise<{ items: Process[]; total: number }> {
    const [items, total] = await this.processesService.findAndCountMany(params)

    return { items, total }
  }
}
