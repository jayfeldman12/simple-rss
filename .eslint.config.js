mobile.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  settings: {
    next: {
      rootDir: 'ui/',
    },
  },
  rules: {
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
  },
};
