var SamlStrategy = require('passport-saml').Strategy;

module.exports = function (passport, conf) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.use(new SamlStrategy({
    path: conf.passport.saml.path,
    entryPoint: conf.passport.saml.entryPoint,
    issuer: conf.passport.saml.issuer,
    callbackUrl: conf.passport.saml.callbackUrl,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    serviceName: conf.passport.saml.serviceName,
    serviceDescription: conf.passport.saml.serviceDescription,
    requestedAttributes: conf.passport.saml.requestedAttributes,
    decryptionCert: conf.passport.saml.decryptionCert,
    decryptionPvk: conf.passport.saml.decryptionPvk,
    privateCert: conf.passport.saml.privateCert,
    publicCert: conf.passport.saml.publicCert,
    disableRequestedAuthnContext: conf.passport.saml.disableRequestedAuthnContext
  },
  function(profile, done) {
    return done(null, {
      id : profile.uid,
      email : profile.email,
      displayName : profile.cn,
      firstName : profile.givenName,
      lastName : profile.sn
    });
  })
);
};
