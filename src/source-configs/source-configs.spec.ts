import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { Controller } from './source-configs.controller'
import { Service } from './source-configs.service'

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
