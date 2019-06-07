"use strict";

/* -----------------------------------------------------------------------------
 * eslint config
 * -------------------------------------------------------------------------- */

module.exports = {
  root: true,
  extends: "standard",
  parserOptions: { ecmaVersion: 10 },
  overrides: [
    {
      files: ["**/*.test.js"],
      env: { mocha: true }
    }
  ]
};
