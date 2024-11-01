export {
  BaseDictionaryTable,
  DictionaryTableRelations,
  DictionaryTable,
  CreateDictionaryTable,
  UpdateDictionaryTable,
  TableSchema,
  Column,
  Row,
} from '~/common/entities/dictionary-table'

// TODO: удалить так как проект ничего не должен знать о схемах
// необходимо написать функции assertSOMETHING и использовать их
export {
  createDictionaryTableSchema,
  updateDictionaryTableSchema,
} from '~/common/entities/dictionary-table/models.dictionary-table'
