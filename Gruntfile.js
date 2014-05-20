module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mongoimport');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mongoimport: {
      options: {
        db: 'agora_dev',
        collections: [
        {
          name: 'countries',
          type: 'json',
          file: 'db/seeds/countries.json',
          jsonArray: true,
          upsert: true,
          drop: true
        },
        {
          name: 'providers',
          type: 'json',
          file: 'db/seeds/providers.json',
          jsonArray: true,
          upsert: true,
          drop: true
        }
        ]
      }
    },
    server: {
       port: 3000,
       base: './public'
    }
  });
  grunt.registerTask('default', []);
  grunt.registerTask('db:import', ['mongoimport']);
};
