import react from 'eslint-plugin-react';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/public/*', '**/node_modules/*'],
  },
  {
    ...react.configs.flat.recommended,
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
