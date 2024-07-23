import { type Prisma, type PrismaClient } from '@prisma/client'

const normalizationConfig1: Prisma.NormalizationConfigCreateInput = {
  id: 'tz4a98xxat96iws9zmbrgj3a',
  v: 1,
  name: 'first',
  current: true,
  createdBy: 'tz4a98xxat96iws9zmbrgj3a',
  updatedBy: 'tz4a98xxat96iws9zmbrgj3a',
  createdAt: '2024-05-28T06:37:43.048Z',
  updatedAt: '2024-05-28T06:37:43.048Z',
  data: getData(),
}

export async function seedNormalizationConfigs(prisma: PrismaClient) {
  await prisma.normalizationConfig.create({
    data: normalizationConfig1,
  })

  const seedPromises = Array(20)
    .fill(undefined)
    .map((_, i) => {
      return prisma.normalizationConfig.create({
        data: { ...normalizationConfig1, name: `seed-${i}` },
      })
    })

  return Promise.allSettled(seedPromises)
}

function getData() {
  return {
    sdk: {
      dnp: {
        format: 'dd.MM.yyyy',
        contour: 'TEST',
        'report-dt': '01.01.1991',
        'main-contour': 'TEST',
        'config-tables-path': 's3a://dnp-case-1/configtables',
        'config-tables-max-size': 300,
      },
      'write-mode': 'overwrite',
      'provider-config': {
        s3: {
          connections: {
            s3_base: {
              connection: {
                bucket: 'dnp-case-1',
                format: 'csv',
                options: {
                  escape: '"',
                  header: 'true',
                  inferSchema: true,
                },
                'dataset-path': 'data/csv',
              },
            },
          },
          'config-by-table': {
            dnp_data: {
              in: {
                connection: {
                  'dataset-name': 'mtr_registry',
                },
              },
              'based-on-in': 's3_base',
            },
            dnp_build_clusters: {
              out: {
                connection: {
                  'dataset-name': 'mtr_registry_clusters',
                },
              },
              'based-on-out': 's3_base',
            },
          },
        },
        jdbc: {
          connections: {
            jdbc_base: {
              connection: {
                url: 'jdbc:postgresql://10.4.40.2:5432/norm?user=postgres&password=123123',
                schema: 'dnp_case_1',
              },
            },
          },
          'config-by-table': {
            dnp_data: {
              out: {
                connection: {
                  dbtable: 'mtr_registry_clusters',
                },
              },
              'based-on-out': 'jdbc_base',
            },
            dnp_feature_collector: {
              in: {
                connection: {
                  dbtable: 'mtr_registry_clean',
                },
              },
              'based-on-out': 'jdbc_base',
            },
            dnp_preprocessing_failed: {
              out: {
                connection: {
                  dbtable: 'mtr_registry_flc',
                },
              },
              'based-on-out': 'jdbc_base',
            },
            dnp_preprocessing_passed: {
              out: {
                connection: {
                  dbtable: 'mtr_registry_clean',
                },
              },
              'based-on-out': 'jdbc_base',
            },
            dnp_feature_insight_scatter: {
              out: {
                connection: {
                  dbtable: 'mtr_registry_feature_scatter',
                },
              },
              'based-on-out': 'jdbc_base',
            },
            dnp_feature_insight_elbow_stats: {
              out: {
                connection: {
                  dbtable: 'mtr_registry_elbow_stats',
                },
              },
              'based-on-out': 'jdbc_base',
            },
          },
        },
      },
      'procedure-config': {
        'dnp-build-clusters-config': {
          'num-clusters': 60,
        },
        'dnp-feature-insight-config': {
          'elbow-step': 5,
          'elbow-lower-k-num': 5,
          'elbow-upper-k-num': 75,
        },
        'dnp-feature-collector-config': {
          features: [
            {
              column: 'mtr_group',
              transform: [
                {
                  type: 'string-indexer-transform',
                },
                {
                  type: 'one-hot-encoder-transform',
                },
              ],
            },
            {
              column: 'mtr_subgroup',
              transform: [
                {
                  type: 'string-indexer-transform',
                },
                {
                  type: 'one-hot-encoder-transform',
                },
              ],
            },
            {
              column: '__clusterization_text__',
              transform: [
                {
                  type: 'tokenizer-transform',
                },
                {
                  type: 'stop-words-remover-transform',
                },
                {
                  type: 'count-vec-transform',
                  'min-df': 2,
                  'vocab-size': 600,
                },
              ],
            },
          ],
        },
      },
      'storage-provider': 'mixed',
      'universal-services': [
        'ru.datatech.sdk.service.dataframe.DFactory',
        'ru.datatech.sdk.service.configtables.ConfigTablesFactory',
        'ru.datatech.sdk.service.procedure.ProcedureConfigFactory',
      ],
    },
    spark: {
      'app.name': 'dnp-demo-dev',
    },
    executables: [
      {
        'sdk-config': {
          version: '1.1.2',
          'sdk-name': 'risk-engine-corp-sdk',
        },
        'computable-config': {
          version: '0.0.1',
          'computable-name': 'dnp-common/artifacts/procedures/DnpDataPreprocessing',
        },
      },
      {
        'sdk-config': {
          version: '1.1.2',
          'sdk-name': 'risk-engine-corp-sdk',
        },
        'computable-config': {
          version: '0.0.1',
          'computable-name': 'dnp-common/artifacts/procedures/DnpFeatureCollector',
        },
      },
      {
        'sdk-config': {
          version: '1.1.2',
          'sdk-name': 'risk-engine-corp-sdk',
        },
        'computable-config': {
          version: '0.0.1',
          'computable-name': 'dnp-common/artifacts/procedures/DnpFeatureInsight',
        },
      },
      {
        'sdk-config': {
          version: '1.1.2',
          'sdk-name': 'risk-engine-corp-sdk',
        },
        'computable-config': {
          version: '0.0.1',
          'computable-name': 'dnp-common/artifacts/procedures/DnpBuildClusters',
        },
      },
      {
        'sdk-config': {
          version: '1.1.2',
          'sdk-name': 'risk-engine-corp-sdk',
        },
        'computable-config': {
          version: '0.0.1',
          'computable-name': 'dnp-common/artifacts/procedures/DnpDataPostprocessing',
        },
      },
    ],
    'preload-jars': [
      {
        name: 'dnp-common/artifacts/functions/DnpFunctions',
        version: '0.0.1',
      },
    ],
    'driver-universal-services': ['ru.datatech.functions.DnpStringFunctions', 'ru.datatech.functions.DnpTaxFunctions'],
  }
}
