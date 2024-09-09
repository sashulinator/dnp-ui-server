import { Delete, Get, Controller as NestJSController, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createId } from '@paralleldrive/cuid2'

import Service from './service'

@NestJSController('api/v1/files')
export default class Controller {
  constructor(private readonly service: Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = `${createId()}-${file.originalname}`

    await this.service.create(file, fileName)

    return { fileName }
  }

  @Get(':id')
  fetchFile(@Param('id') id: string) {
    return this.service.getUnique(id)
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.service.delete(id)
    return { id }
  }
}
