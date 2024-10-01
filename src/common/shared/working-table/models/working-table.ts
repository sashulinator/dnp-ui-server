import * as v from 'valibot'

import {
  columnModel as dtColumnModel,
  databaseTableModel as dtDatabaseTableModel,
  relationModel as dtRelationModel,
} from '../../database-table'

/**
 * DatabaseTable
 */

export const databaseTableModel = v.intersect([
  dtDatabaseTableModel,
  v.object({
    defaultView: v.union([v.literal('tree'), v.literal('table')]),
  }),
])

export type DatabaseTable = v.InferOutput<typeof databaseTableModel>

/**
 * Column
 */

export const columnModel = dtColumnModel

export type Column = v.InferOutput<typeof columnModel>

/**
 * Relation
 */

export const relationModel = dtRelationModel

export type Relation = v.InferOutput<typeof columnModel>