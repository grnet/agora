module.exports = function(config){
  config.set({

    basePath : '.',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-resource/angular-resource.js',      
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app.js',
      'utils-service.js',
      'cloudserviceproviders/*.js',
      'cloudservices/*.js',
      'error/*.js',      
      'login/*.js',
      'main/*.js',
      'users/*.js',
      'criteria/*.js',
      'countries/*.js',      
      'navbar/*.js'
    ],

    autowatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
