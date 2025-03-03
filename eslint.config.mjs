import tseslint from 'typescript-eslint';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import js from '@eslint/js';

import { fileURLToPath } from 'node:url';

import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      '**/.json',
      '**/dist/**/*',
      '**/vendor/**/*',
      'package.json',
      'node_modules/**/*',
      'eslint.config.mjs',
    ],
  },
  // defaults
  js.configs.recommended,
  // ts eslint
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  // prettier
  { plugins: { prettier: eslintPluginPrettier } },
  // rewrite ts eslint rules
  {
    files: ['**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      'eslint-disable-next-line @typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        NodeJS: true,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
];
