import { APP } from '~/app/constants.app'

import { currentAppService } from './service'

export const operationalDatabase = {
  id: 'this-app-operational-data',
  display: 'База операционных данных',
  name: `${APP}-operational-data`,
  serviceId: currentAppService.id,
}

export const initialDatabase = {
  id: 'this-app-initial-data',
  display: 'База исходных данных',
  name: `${APP}-initial-data`,
  serviceId: currentAppService.id,
}

export const targetDatabase = {
  id: 'this-app-target-data',
  display: 'База целевых данных',
  name: `${APP}-target-data`,
  serviceId: currentAppService.id,
}

export default [operationalDatabase]
