import { type Knex } from 'knex'

import { type DatabaseConfigMap } from '../../_lib/get-database-config-map'
import { systemUser } from './users'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function run(appKnex: Knex, databaseConfigMap: DatabaseConfigMap) {
  await appKnex('User').insert(systemUser).onConflict(['id']).merge()
  console.log(`User with name '${systemUser.name}' upserted.`)
}
