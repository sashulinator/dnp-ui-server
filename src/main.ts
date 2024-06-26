import { NestFactory } from '@nestjs/core'

import AppModule from './app/module'

async function bootstrap() {
  const port = process.env.PORT || 3000

  const app = await NestFactory.create(AppModule)
  await app.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Started on http://localhost:${port}`)
}
bootstrap()
