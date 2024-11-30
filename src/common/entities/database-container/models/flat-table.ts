/**
 * Таблица со всеми родительскими контейнерами в плоском виде и колонками
 */
export type FlatTable = {
  id: string
  name: string
  display: string
  schemaId: string
  schemaName: string
  schemaDisplay: string
  databaseId: string
  databaseName: string
  databaseDisplay: string
  serviceId: string
  serviceDisplay: string
  serviceHost: string
  servicePort: number
  serviceUsername: string
  servicePassword: string
  columns:
    | null
    | {
        id: string
        name: string
        display: string
        type: string
      }[]
}
