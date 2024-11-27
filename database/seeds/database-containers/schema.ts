import { operationalDatabase } from './database'

export const currentAppOperationalSchema = {
  id: 'this-app-operational-schema',
  display: 'Public',
  name: 'public',
  databaseId: operationalDatabase.id,
}

export default [currentAppOperationalSchema]
