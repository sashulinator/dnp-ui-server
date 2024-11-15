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

import { FileService } from './nest.service'

type UploadParam = {
  bucketName: string
  fileName: string
}

@NestJSController('api/v1/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Body() body: UploadParam, @UploadedFile() file: Express.Multer.File) {
    const fileNameSplitted = body.fileName.split('.')
    const fileExt = fileNameSplitted[fileNameSplitted.length - 1]
    const fileName = fileNameSplitted.slice(0, fileNameSplitted.length - 1).join('.')
    const newFileName = `fileName=${fileName}&id=${createId()}.${fileExt}`

    const minioRet = await this.fileService.create(file, newFileName, body.bucketName)

    return { ...minioRet, fileName: newFileName, bucketName: body.bucketName }
  }

  @Get(':id')
  fetchFile(@Param('id') id: string) {
    return this.fileService.getUnique(id)
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileService.delete(id)
    return { id }
  }
}
