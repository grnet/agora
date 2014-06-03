module.exports = function(mongoose) {
  var bcrypt = require('bcrypt-nodejs'),
      passport = require('passport');

  var SALT_WORK_FACTOR = 10;

  var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    group: { type: String, required: true },
    provider_id: { type: String }
  });


  // Bcrypt middleware on UserSchema
  UserSchema.pre('save', function(next) {
      var user = this;

      if (!user.isModified('password')) return next();

      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) return next(err);

          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) return next(err);
              user.password = hash;
              next();
          });
      });
  });

  //Password verification
  UserSchema.methods.comparePassword = function(pass, cb) {
    bcrypt.compare(pass, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
  };


  var User = mongoose.model('User', UserSchema);


  return User;
}
