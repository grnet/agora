exports.config = {
  allScriptsTimeout: 11000,
  seleniumServerJar: "../node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar",
  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8080',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
