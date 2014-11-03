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
  if ( config.passport.saml.publicCertName
        && config.passport.saml.privateCertName
        && fs.existsSync(__dirname + "/" + config.passport.saml.publicCertName)
        && fs.existsSync(__dirname + "/" + config.passport.saml.privateCertName)) {
    config.passport.saml.publicCert = fs.readFileSync(__dirname + "/" + config.passport.saml.publicCertName, 'utf-8');
    config.passport.saml.privateCert = fs.readFileSync(__dirname + "/" + config.passport.saml.privateCertName, 'utf-8');
  }
  if ( config.passport.saml.decryptionCertName
        && config.passport.saml.decryptionPvkName
        && fs.existsSync(__dirname + "/" + config.passport.saml.decryptionCertName)
        && fs.existsSync(__dirname + "/" + config.passport.saml.decryptionPvkName)) {
    config.passport.saml.decryptionCert = fs.readFileSync(__dirname + "/" + config.passport.saml.decryptionCertName, 'utf-8');
    config.passport.saml.decryptionPvk = fs.readFileSync(__dirname + "/" + config.passport.saml.decryptionPvkName, 'utf-8');
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
