module.exports = {
  env: {
    browser: false,
    commonjs: true,
    node: true,
    es2021: true,
  },
  // Adding airbnb-base throw an error
  extends: ['eslint:recommended', 'plugin:import/recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 'import/no-unresolved': [2, { commonjs: false }],
  },
};
