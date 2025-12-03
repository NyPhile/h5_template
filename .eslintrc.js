module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    "linebreak-style": [0 , 'error', 'windows'],
    indent: [1, 2, {SwitchCase: 1}]
  }
}