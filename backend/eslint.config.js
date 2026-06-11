import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'logs', 'node_modules', 'tests'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // we throw `unknown` in a couple of places and narrow it ourselves
      '@typescript-eslint/no-explicit-any': 'off',
      // express error handlers need the 4th `next` arg even when unused
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
);
