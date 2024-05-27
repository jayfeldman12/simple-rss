module.exports = {
  extends: ['expo', 'prettier', 'stylelint'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'n/no-missing-import': ['off'],
  },
};
