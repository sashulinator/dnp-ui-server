export const roles = {
  // TODO: удалить как только перестанут быть использованы в проекте
  admin: 'admin',
  operator: 'operator',

  approver: 'approver',

  /**
   * normalization
   */

  nrm_get: 'nrm:get',
  nrm_crt: 'nrm:crt',
  nrm_upd: 'nrm:upd',
  nrm_del: 'nrm:del',

  /**
   * operationalTable
   */

  opt_dt_imp: 'opt:dt:imp',
  opt_dt_apr: 'opt:dt:apr',
  opt_get: 'opt:get',
  opt_crt: 'opt:crt',
  opt_upd: 'opt:upd',
  opt_del: 'opt:del',

  /**
   * targetTable
   */

  trt_get: 'trt:get',
  trt_crt: 'trt:crt',
  trt_upd: 'trt:upd',
  trt_del: 'trt:del',

  /**
   * dictionaryTables
   */

  dct_get: 'dct:get',
  dct_crt: 'dct:crt',
  dct_upd: 'dct:upd',
  dct_del: 'dct:del',

  /**
   * storeConfig
   */

  stc_get: 'stc:get',
  stc_crt: 'stc:crt',
  stc_upd: 'stc:upd',
  stc_del: 'stc:del',
} as const

export type Roles = (typeof roles)[keyof typeof roles]
