import { NAME } from '~/common/shared/working-table/constants/name'
import { uncapitalize, unspace } from '~/utils/string'

const SYSNAME = unspace(uncapitalize(NAME))

export { NAME, SYSNAME }
