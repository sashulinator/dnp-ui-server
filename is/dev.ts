/**
 * Returns `true` if the application is running in a development environment, `false` otherwise.
 *
 * @return {boolean} `true` if the application is in development, `false` otherwise.
 */
export function isDev(): boolean {
  if (localStorage.getItem('env') === 'production') {
    return false
  }

  return process.env.NODE_ENV === 'development' || localStorage.getItem('env') === 'dev'
}
