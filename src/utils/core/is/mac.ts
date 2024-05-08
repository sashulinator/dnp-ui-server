export function isMac(): boolean {
  return navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
}
