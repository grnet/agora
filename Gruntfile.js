var config = require('./backend/config');

console.log(config.mongo_db);
console.log(config.mongo_options.user);
console.log(config.mongo_options.pass);
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mongoimport: {
      options: {
        db: config.mongo_db,
        username: config.mongo_options.user,
        password: config.mongo_options.pass,
        collections: [
          {
            name: 'countries',
            type: 'json',
            file: 'backend/db/seeds/countries.json',
            jsonArray: true,
            upsert: true,
            drop: true
          },
          {
            name: 'cloudserviceproviders',
            type: 'json',
            file: 'backend/db/seeds/cloudserviceproviders.json',
            jsonArray: true,
            upsert: true,
            drop: true
          },
          {
            name: 'cloudservices',
            type: 'json',
            file: 'backend/db/seeds/cloudservices.json',
            jsonArray: true,
            upsert: true,
            drop: true
          },
          {
            name: 'cloudserviceprofiles',
            type: 'json',
            file: 'backend/db/seeds/cloudserviceprofiles.json',
            jsonArray: true,
            upsert: true,
            drop: true
          }          
        ]
      }
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('db:import', ['mongoimport']);
};
