var fs = require('fs');

var config
  , config_file = __dirname + '/' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') + '.json';
 
try {
  // config = require(config_file);
  config = (JSON.parse(fs.readFileSync(config_file, "utf8")));
} catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV 
      + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
    process.exit(1);
  } else {
    throw err;
  }
}
module.exports = config;