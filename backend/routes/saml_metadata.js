var express = require('express');
var router = express.Router();
var conf = require('../config');
var SamlStrategy = require('passport-saml').Strategy;

    
router.get('/', function(req, res, next) {
  var samlConfig = {
    issuer: conf.passport.saml.issuer,
    path: conf.passport.saml.path,
    callbackUrl: conf.passport.saml.callbackUrl,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    serviceName: conf.passport.saml.serviceName,
    serviceDescription: conf.passport.saml.serviceDescription,
    requestedAttributes: conf.passport.saml.requestedAttributes,
    decryptionCert: conf.passport.saml.decryptionCert,
    decryptionPvk: conf.passport.saml.decryptionPvk,
    privateCert: conf.passport.saml.privateCert,
    publicCert: conf.passport.saml.publicCert
  };
  var strategy = new SamlStrategy( samlConfig, function() {} );
  res.set('Content-Type', 'text/xml');
  res.send(strategy.generateServiceProviderMetadata( conf.passport.saml.decryptionCert ));
});

module.exports = router;