import { type Knex } from 'knex'

export default async function count(
  knex: Knex,
  tableName: string,
  params: { where?: Record<string, string> } = {}
): Promise<number> {
  const { where } = params
  const queryBuilder = knex<unknown, { count: string }>(tableName)

  if (where) {
    queryBuilder.where(where)
  }

  queryBuilder.count('*').first()

  const ret = await queryBuilder

  return parseInt(ret.count)
}
