import { type BuildColumnProps } from '~/lib/database'
import { type TableSchemaItem } from '../dto'

/**
 * Для промежуточных таблиц колонки типа string
 * так как в таблицу может прилететь невалидное значение
 * и только стринг может его проглотить
 */
export function toDatabaseBuildColumnProps(item: TableSchemaItem): BuildColumnProps {
  return {
    ...item,
    type: 'string',
  }
}
