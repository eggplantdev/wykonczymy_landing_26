import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/lib/env.ts',
      'src/lib/env.server.ts',
      'src/lib/env-schema.ts',
      'src/payload.config.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env']:not([property.name='NODE_ENV'])",
          message: 'Read env through src/lib/env.ts or env.server.ts, never raw process.env.',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      // The plugin resolves every class against the real compiled theme, so an invented
      // utility is a lint error rather than a class that silently emits nothing. That is the
      // whole reason it is here: `mb-` and `text-hero-lg` both shipped and both compiled to
      // nothing at all.
      'better-tailwindcss': { entryPoint: 'src/app/(frontend)/styles.css' },
    },
    // Correctness only. The stylistic half (class order, line wrapping) is Prettier's job
    // via `prettier-plugin-tailwindcss`, and enabling both makes them fight over the same
    // attribute.
    rules: betterTailwindcss.configs['correctness-error'].rules,
  },
  {
    ignores: ['.next/', 'src/migrations/', 'src/payload-types.ts'],
  },
]

export default eslintConfig
