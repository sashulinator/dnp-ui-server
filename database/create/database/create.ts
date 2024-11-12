import { type Knex } from 'knex'

import { asyncCatchError } from '../../_utils/catch-error'

export async function create(knex: Knex, databaseName: string) {
  const [error] = await asyncCatchError(knex.raw(`CREATE DATABASE ${databaseName}`))

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
