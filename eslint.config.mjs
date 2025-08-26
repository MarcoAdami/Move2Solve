import { FlatCompat } from '@eslint/eslintrc'
 
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
 
const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  {
    rules: {
      // Disabilita la regola specifica
      'react/no-unescaped-entities': 'off',
      
      // Esempio di come disabilitare un'altra regola
      // 'eslint-rule-name': 'off',
    },
  },
]
 
export default eslintConfig