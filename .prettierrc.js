module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  endOfLine: 'auto',
  importOrder: ['reset.css$', 'css$', '^@', '^[a-z]', '^~', '^.'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
