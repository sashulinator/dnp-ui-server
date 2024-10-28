export const roles = {
  // TODO: удалить как только перестанут быть использованы в проекте
  admin: 'admin',
  approver: 'approver',
  operator: 'operator',

  /**
   * normalization
   */

  nrm_get: 'nrm:get',
  nrm_crt: 'nrm:crt',
  nrm_upd: 'nrm:upd',
  nrm_del: 'nrm:del',
}

export type Roles = (typeof roles)[keyof typeof roles]
