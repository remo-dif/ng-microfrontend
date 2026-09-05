import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'scope:shell', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:auth', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:products', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:orders', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:profile', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'scope:admin', onlyDependOnLibsWithTags: ['scope:shared'] },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:model', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:model', 'type:util'],
            },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:model', 'type:util'] },
            { sourceTag: 'type:model', onlyDependOnLibsWithTags: ['type:model'] },
            { sourceTag: 'type:util', onlyDependOnLibsWithTags: ['type:model', 'type:util'] },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
