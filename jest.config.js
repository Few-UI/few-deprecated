/* eslint-env amd, es6, node */
module.exports = {
    verbose: true,
    testMatch: [
        '**/test/*.test.js',
        '**/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x)'
    ],
    /*
    moduleNameMapper: {
        '^afx-next/src/(.*)$': '<rootDir>/src/$1'
    },
    */
    collectCoverageFrom: [
      '**/*.{js,jsx}'
    ],
    coveragePathIgnorePatterns: [
      '<rootDir>[/\\\\](coverage|dist|docs|flow-typed|node_modules|config|test)[/\\\\]',
      'jest.config.js',
      'rollup.config.js'
    ],
    setupFiles: [
      // '<rootDir>/config/jest/polyfills.js'
      // npm install jest babel-jest babel-polyfill mutationobserver-shim document-register-element --save-dev
      // '<rootDir>/node_modules/babel-polyfill/dist/polyfill.js'
      // '<rootDir>/node_modules/mutationobserver-shim/dist/mutationobserver.min.js',
      // '<rootDir>/node_modules/document-register-element/build/document-register-element.node.js'
    ],
    /*
    setupTestFrameworkScriptFile: '<rootDir>/index-specrunner.js',
    */
    testPathIgnorePatterns: [
      '<rootDir>[/\\\\](coverage|dist|docs|node_modules|config)[/\\\\]'
    ],
    // testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': [ 'babel-jest', {
          presets: [
              [ '@babel/preset-env', {
                  targets: {
                      node: 'current'
                  }
              } ]
          ]
      } ]
      // '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
      // '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js'
    },
    testEnvironment: 'node',
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
    ]
};
