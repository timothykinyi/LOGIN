// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      es2021: true,
      serviceworker: true, // Adding serviceworker environment
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    globals: {
      self: 'readonly', // Allow `self` global variable
    },
    rules: {
      'no-restricted-globals': ['error', 'event', 'fdescribe'], // Customize this if needed
    },
  };
  