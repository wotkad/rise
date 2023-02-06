module.exports = {
  "extends": [
    "eslint:recommended"
  ],
  "parser": "@babel/eslint-parser",
  "rules": {
    "no-unused-vars": "off",
    "no-prototype-builtins": "off",
    "no-undef": "off",
    "no-global-assign": "off",
    "no-self-assign": "off",
    "no-trailing-spaces": ["error"],
  },
  "plugins": [
    "pug"
  ]
}
