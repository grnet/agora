
module.exports.importProviders = function (cb) {

    Provider.count().exec(function(err, count) {
        if(err) {
            sails.log.error(err);
            return cb(err);
        }
        if(count > 0) return cb();
        sails.log.info("Seeding providers");
        SeedProviders.seed();
    });
    cb();
};
