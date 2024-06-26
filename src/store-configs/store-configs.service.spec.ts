import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

import { Service } from './store-configs.service'

describe('TranslationsService', () => {
  let service: Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Service],
    }).compile()

    service = module.get<Service>(Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
