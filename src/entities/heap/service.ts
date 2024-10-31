import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import type { Heap } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { isInstanceOf } from 'utils/core'

import PrismaService from '../../shared/prisma/service'

@Injectable()
export default class Service {
  constructor(private prisma: PrismaService) {}

  async getHeapByName(name: string): Promise<Heap> {
    try {
      return await this.prisma.heap.findUniqueOrThrow({
        where: { name },
      })
    } catch (error) {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Heap not found', HttpStatus.NOT_FOUND)
    }
  }

  async updateHeapByName(name: string, updateData: Prisma.HeapUpdateInput): Promise<Heap> {
    try {
      return await this.prisma.heap.update({
        where: { name },
        data: updateData,
      })
    } catch (error) {
      if (!isInstanceOf(error, Prisma.PrismaClientKnownRequestError) || error.code !== 'P2025') throw error
      throw new HttpException('Heap not found', HttpStatus.NOT_FOUND)
    }
  }
}
