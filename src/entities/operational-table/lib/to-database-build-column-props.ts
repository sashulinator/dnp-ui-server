import { type BuildColumnProps } from '~/lib/database'
import { type TableSchemaItem } from '../dto'

/**
 * Так как в Промежуточные Таблицы может прилететь невалидные значения,
 * а нам нужно чтобы она проглатывала всё
 * 1. конвертируем тип колонки в string
 * 2. Удаляем relation
 */
export function toDatabaseBuildColumnProps(item: TableSchemaItem): BuildColumnProps {
  const clone = { ...item }

  delete clone.relation

  return {
    ...clone,
    type: 'string',
  }
}
