import { Get, Controller as NestJSController } from '@nestjs/common'

@NestJSController('/health')
export default class Controller {
  @Get()
  health(): string {
    return 'running'
  }
}
