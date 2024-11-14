import {
  Body,
  Delete,
  Get,
  Controller as NestJSController,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createId } from '@paralleldrive/cuid2'

import Service from './service'

type UploadParam = {
  bucketName: string
  fileName: string
}

@NestJSController('api/v1/files')
export default class Controller {
  constructor(private readonly service: Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Body() body: UploadParam, @UploadedFile() file: Express.Multer.File) {
    const fileNameSplitted = body.fileName.split('.')
    const fileExt = fileNameSplitted[fileNameSplitted.length - 1]
    const fileName = fileNameSplitted.slice(0, fileNameSplitted.length - 1).join('.')
    const newFileName = `fileName=${fileName}&id=${createId()}.${fileExt}`

    const minioRet = await this.service.create(file, newFileName, body.bucketName)

    return { ...minioRet, fileName: newFileName, bucketName: body.bucketName }
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
