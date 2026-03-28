const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', 'build/**', '.expo/**', 'node_modules/**'],
  },
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
])
