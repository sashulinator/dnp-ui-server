module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: { node: true, jest: true },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint/eslint-plugin'],
  ignorePatterns: ['dist', '.eslintrc.js'],
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-console': ['error'],
  },
}
