/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app
 * gets lifted.
 *
 * This gives you an opportunity to set up your data model, run jobs,
 * or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are
  // finished with the bootstrap! (otherwise your server will never
  // lift, since it's waiting on the bootstrap)
  Country.count().exec(function(err, count) {
    if(err) {
      sails.log.error(err);
      return cb(err);
    }
    if(count > 0) return cb();
    sails.log.info("Seeding countries")
    SeedCountries.seed();
  });
  cb();
};
