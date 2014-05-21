exports.config = {
  allScriptsTimeout: 11000,
  seleniumServerJar: "/tmp/selenium-server-standalone-2.41.0.jar",
  specs: [
    'e2e/*.js'
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
