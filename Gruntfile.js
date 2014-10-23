var config = require('./backend/config');

console.log(config.mongo_db);
console.log(config.mongo_options.user);
console.log(config.mongo_options.pass);
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });
  grunt.registerTask('default', []);
};
