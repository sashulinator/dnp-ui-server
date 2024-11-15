import { ConfigBuilder } from '~/slices/engine'

interface CreateConfigParams {
  sourceFileName: string
  fileExtension: string
  destinationTable: string
  trackingId: number
  bucketName: string
  databaseConfig: {
    username: string
    password: string
    database: string
    host: string
    port: number
  }
}

export const createImportOperationalTableNormalizationConfig = ({
  sourceFileName,
  fileExtension,
  destinationTable,
  trackingId,
  bucketName,
  databaseConfig,
}: CreateConfigParams) => {
  const JDBC_NAME = 'jdbc_base'
  const S3_NAME = 's3_base'

  return new ConfigBuilder()
    .setTrackId(trackingId)
    .addConnection(JDBC_NAME, {
      client: 'postgresql',
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      username: databaseConfig.username,
      password: databaseConfig.password,
      schema: 'public',
      truncate: true,
    })
    .addOut('dnp_data', { table: destinationTable }, JDBC_NAME)
    .addConnection(S3_NAME, {
      format: fileExtension === 'csv' ? 'csv' : 'excel',
      path: `/`,
      bucket: bucketName,
      options: {
        header: true,
        delimiter: ';',
      },
    })
    .addIn(
      'dnp_data',
      {
        fileName: sourceFileName,
      },
      S3_NAME,
    )
    .addExecutable({
      indentity: {
        id: 'DnpDataPostprocessing',
      },
      'computable-config': {
        'computable-name': 'dnp-common/artifacts/procedures/DnpDataPostprocessing',
        version: '0.0.1',
      },
      'sdk-config': {
        'sdk-name': 'risk-engine-corp-sdk',
        version: '1.1.2',
      },
    })
    .build()
}
