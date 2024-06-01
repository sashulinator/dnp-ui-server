import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { Controller } from './processes.controller'
import { Service } from './processes.service'

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
