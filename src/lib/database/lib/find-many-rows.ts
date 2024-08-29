import { type Knex } from 'knex'

// Метод findMany с параметрами limit, offset, where
export async function findManyRows(
  knex: Knex,
  tableName: string,
  params: { limit?: number; offset?: number; where?: Record<string, string> | undefined } = {}
): Promise<unknown[]> {
  const { limit, offset, where } = params
  const queryBuilder = knex(tableName)

  // Добавляем ограничения (limit, offset)
  if (limit) {
    queryBuilder.limit(limit)
  }
  if (offset) {
    queryBuilder.offset(offset)
  }

  // Добавляем условие WHERE
  if (where) {
    // Преобразуем объект where в условия knex
    for (const [key, value] of Object.entries(where)) {
      queryBuilder.orWhereILike(key, value)
    }
  }

  const ret = await queryBuilder

  return ret
}
