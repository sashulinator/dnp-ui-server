import { type Knex } from 'knex'

import { asyncCatchError } from '../../src/utils/error/catch-error'

export async function createDatabase(knex: Knex, databaseName: string) {
  const [error] = await asyncCatchError<Error>(knex.raw(`CREATE DATABASE ${databaseName}`))

  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`Database '${databaseName}' already exists`)
    } else {
      throw error
    }
  } else {
    console.log(`Database '${databaseName}' created.`)
  }
}
