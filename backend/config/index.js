var fs = require('fs');

var config
  , config_file = __dirname + '/'
    + (process.env.NODE_ENV ? process.env.NODE_ENV : 'local') + '.json';
 
try {
  // config = require(config_file);
  config = (JSON.parse(fs.readFileSync(config_file, "utf8")));
  config.ssl = false;
  if ( config.ssl_options
      && fs.existsSync(__dirname + "/" + config.ssl_options.ssl_key)
      && fs.existsSync(__dirname + "/" + config.ssl_options.ssl_cert)) {
    config.ssl = true;
    config.ssl_options.key = fs.readFileSync(__dirname + "/" + config.ssl_options.ssl_key);
    config.ssl_options.cert = fs.readFileSync(__dirname + "/" + config.ssl_options.ssl_cert);
  }
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
