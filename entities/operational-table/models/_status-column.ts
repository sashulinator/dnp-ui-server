import { type Column } from '../../../slices/working-table'

export const _statusColumn: Column = {
  id: 'status',
  display: 'Статус',
  columnName: '_status',
  type: 'string',
  defaultTo: '0',
  maxLength: 1,
}
