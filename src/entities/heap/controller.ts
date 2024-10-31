import { Body, Get, HttpStatus, Controller as NestJSController, Param, Put, Res } from '@nestjs/common'

import { Response } from 'express'

import type { UpdateBaseHeapSchema } from '~/common/entities/heap'

import Service from './service'

@NestJSController('api/v1/heaps')
export class Controller {
  constructor(private readonly service: Service) {}

  /* ------------ GET HEAP BY NAME ------------
   *
   * Get a heap by its name
   *
   * @param {string} name The name of the heap to find
   * @param {Response} res The response object
   * @returns A response with the found heap or an error message
   */
  @Get(':name')
  async getHeap(@Param('name') name: string, @Res() res: Response) {
    try {
      const heap = await this.service.getHeapByName(name)
      if (!heap) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Heap not found' })
      }
      return res.json(heap)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  /* ------------ UPDATE HEAP ------------
   *
   * Update a heap by its name
   *
   * @param {string} name The name of the heap to update
   * @param {{ description: string; data: any }} body The data to update the heap
   * @param {Response} res The response object
   * @returns A response with the updated heap or an error message
   */
  @Put(':name')
  async updateHeap(
    @Param('name') name: string,
    @Body() body: { description: string; data: UpdateBaseHeapSchema },
    @Res() res: Response,
  ) {
    try {
      const updatedHeap = await this.service.updateHeapByName(name, body)
      return res.json(updatedHeap)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }
}
