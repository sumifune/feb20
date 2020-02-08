var passport = require("passport");
var User = require("../models/user");
let { redisClient } = require("../redis.js");

var LocalStrategy = require("passport-local").Strategy;

passport.use(
  "login",
  new LocalStrategy(
    {
      // define the parameters in req.body that passport
      // can use as username and password
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      let key = req.ip + "-" + req.body.email;

      function universalDelay(cb) {
        setTimeout(function() {
          redisClient.del(key);
          cb();
        }, 5000);
      }

      redisClient.exists(key, function(err, reply) {
        if (err) {
          throw err;
        }
        if (reply) {
          redisClient.del(key);
          return done(null, false, {
            message: "Authentication already in progress"
          });
        }
      });

      redisClient.set(key, 1);

      User.findOne({ email: email }, function(err, user) {
        if (err) {
          redisClient.del(key);
          return done(err);
        }
        if (!user) {
          return universalDelay(() => {
            done(null, false, {
              message: "There is no such a user (ofuscate this)"
            });
          });
        }
        user.checkPassword(password, function(err, isMatch) {
          if (err) {
            redisClient.del(key);
            return done(err);
          }
          if (isMatch) {
            redisClient.del(key);
            return done(null, user);
          } else {
            return universalDelay(() => {
              done(null, false, {
                message: "Invalid password (ofuscate this)"
              });
            });
          }
        });
      });
    }
  )
);

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
