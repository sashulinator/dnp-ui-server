import { Test, TestingModule } from '@nestjs/testing'
import { Controller } from './translations.controller'
import { Service } from './translations.service'

describe('TranslationsController', () => {
  let controller: Controller

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Controller],
      providers: [Service],
    }).compile()

    controller = module.get<Controller>(Controller)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
