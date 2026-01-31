import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/.*.js', '**/node_modules/', '**/dist/', '**/src/generated/', '**/*-env.d.ts', '**/*.config.cjs']),
  eslint.configs.recommended,
  tseslint.configs.strict,
  prettierConfig,
  unicornPlugin.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    settings: {
      'import/internal-regex': '^@repo/',
    },

    rules: {
      'no-empty-pattern': 'off',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'error',
        {
          'groups': [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'import/no-unresolved': 'off',
      'import/no-named-as-default-member': 'off',
      'import/named': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'unicorn/prefer-module': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            props: false,
            Props: false,
            ref: false,
            Ref: false,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.js?(x)', '**/*.ts?(x)'],
  },
  {
    files: ['src/cli/**/*.ts'],
    rules: {
      'unicorn/no-process-exit': 'off',
    },
  },
]);
