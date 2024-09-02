import { Delete, Get, Controller as NestJSController, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import Service from './service'
import { createId } from '@paralleldrive/cuid2'

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
  fetchFile(id: string) {
    return this.service.getUnique(id)
  }

  @Delete(':id')
  async deleteFile(id: string) {
    await this.service.delete(id)
    return { id }
  }
}
