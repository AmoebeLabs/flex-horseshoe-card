import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { configs, plugins } from "eslint-config-airbnb-extended";

export default defineConfig([
  globalIgnores([
    '/distjs/*',
    '/dist/*',
    '/src/flex-horseshoe-card.js',
  ]),

  plugins.stylistic,
  plugins.importX,

  ...configs.base.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        Event: "readonly",
        customElements: "readonly",
      },

      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },      
    },

    rules: {
      "no-else-return": 0,
      "no-underscore-dangle": 0,
      "nonblock-statement-body-position": 0,
      "@stylistic/nonblock-statement-body-position": 0,

      curly: 0,
      "no-return-assign": 0,
      "consistent-return": 0,
      "no-mixed-operators": 0,
      "@stylistic/no-mixed-operators": 0,
      "class-methods-use-this": 0,
      "no-nested-ternary": 0,
      camelcase: 0,
      "no-param-reassign": 0,

      "@stylistic/max-statements-per-line": 0,
      "max-len": ["warn", {
        code: 220,
        ignoreComments: true,
      }],

      "@stylistic/max-len": ["warn", {
        code: 220,
        ignoreComments: true,
      }],

      eqeqeq: 1,

      "brace-style": 1,
      "@stylistic/brace-style": 1,

      "function-call-argument-newline": 0,
      "@stylistic/function-call-argument-newline": 0,

      "function-paren-newline": 0,
      "@stylistic/function-paren-newline": 0,

      "no-plusplus": ["warn", {
        allowForLoopAfterthoughts: true,
      }],

      "no-irregular-whitespace": 0,

      "no-bitwise": ["warn", {
        allow: ["~"],
      }],

      "no-console": 0,
      "no-prototype-builtins": 0,
      "func-names": ["warn", "as-needed"],
      "prefer-destructuring": 0,
      "no-restricted-globals": 0,

      indent: 0,
      "@stylistic/indent": 0,

      "no-unreachable": 0,
      "block-scoped-var": 0,
      "vars-on-top": 0,
      "no-var": 0,
      "no-redeclare": 0,
      "no-setter-return": 0,
      "no-multi-assign": 0,
      "no-empty": 0,
      "no-unused-vars": 0,
      "prefer-const": 0,
      "no-lonely-if": 0,
      "no-shadow": 0,
      "no-loop-func": 0,
      "no-undef": 2,
      "no-use-before-define": 1,
      "no-case-declarations": 1,
      "no-inner-declarations": 1,
      "array-callback-return": 1,
      "max-classes-per-file": 1,
      "no-new-func": 1,
      "no-constant-condition": 1,
      "default-case": 1,
      "default-case-last": 1,
      "operator-assignment": 1,
      "no-sequences": 1,
      "no-restricted-syntax": 1,
      "no-unused-expressions": 1,
      "no-useless-escape": 1,
      "no-template-curly-in-string": 1,

      "import-x/extensions": 0,
      "import-x/no-unresolved": 1,
    },
  },
]);