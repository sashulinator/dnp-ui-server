import { type Column } from '../../../slices/table'

export const _statusColumn: Column = {
  id: 'status',
  display: 'Статус',
  name: '_status',
  type: 'string',
  defaultTo: '0',
  maxLength: 1,
}
