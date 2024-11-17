/* eslint-disable no-console */
import { type Knex } from 'knex'

import { asyncCatchError } from '../../src/utils/error/catch-error'

export async function dropDatabase(knex: Knex, databaseName: string) {
  const [error] = await asyncCatchError<Error>(knex.raw(`DROP DATABASE ${databaseName} WITH (FORCE);`))

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log(`Database '${databaseName}' does not exist.`)
    } else {
      throw error
    }
  } else {
    console.log(`Database '${databaseName}' dropped.`)
  }
}
