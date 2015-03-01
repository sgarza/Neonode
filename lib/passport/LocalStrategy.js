var LocalStrategy     = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(req, email, password, done) {

  User.findBy('email', email, function(err, user) {
    if (err) { return done(err) }

    if (user.length > 0) {
      return done(null, false) // User already exists
    } else {
      var newUser = new User();

      newUser.email = email;
      newUser.setPassword(password);

      newUser.save(function(err, result) {
        if (err) {
          return done(err);
        };

        newUser.id = result[0];

        return done(null, newUser);
      });
    }
  });

}));

passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
}, function(err, email, password, done) {

  User.findBy('email', email,  function(err, user) {
    logger.log('login', email)
    if (err) {
      done(err);
    }

    if (user.length === 0) {
      logger.error('User not found');
      return done(null, false); // User not found
    }

    user = user[0];

    var validPass = bcrypt.compareSync(password, user.password);

    if (!validPass) {
      logger.error('Invalid password');
      return done(null, false); // Invalid password
    }

    done(null, user);
  });
}));
