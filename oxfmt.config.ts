import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  sortPackageJson: {
    sortScripts: true,
  },
  sortImports: {
    newlinesBetween: true,
    customGroups: [
      {
        groupName: 'react-libs',
        elementNamePattern: ['react', 'react-**'],
      },
    ],
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
});
