import { parseDatabaseUrl } from '~/utils/database'

import { getEnvVariable } from '../../_lib/get-env-variables'

const databaseConfig = parseDatabaseUrl(getEnvVariable('DATABASE_URL'))
const externalHost = getEnvVariable('EXTERNAL_HOST')

export const currentAppService = {
  id: 'this-app',
  display: 'Текущее приложение',
  host: externalHost,
  port: Number(databaseConfig.port),
  username: databaseConfig.user,
  password: databaseConfig.password,
}

export default [currentAppService]
