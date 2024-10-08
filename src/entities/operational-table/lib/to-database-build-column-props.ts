import { type BuildColumnProps } from '~/shared/database'

import { type TableSchemaItem } from '../dto'

/**
 * Так как в Промежуточные Таблицы может прилететь невалидные значения,
 * а нам нужно чтобы она проглатывала всё
 * 1. конвертируем тип колонки в string
 * 2. Удаляем relation
 */
export function toDatabaseBuildColumnProps(item: TableSchemaItem): BuildColumnProps {
  return {
    columnName: item.columnName,
    defaultTo: item?.defaultTo,
    index: item?.index,
    type: 'string',
  }
}
