/**
 * Authentication manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var config = require('config');
var Users = require('./models/users');
var Constants = require('./constants');

var Authentication = {
  /**
   * Configure authentication.
   *
   * @param {Object} passport Initialized Passport instance.
   */
  configure: function(app, passport) {
    app.use(session({             // Configure Express session
      secret: config.get('authentication.secret'),
      resave: false,
      saveUninitialized: true,
      cookie: {secure: true}       // Cookies only allowed over HTTPS
    }));
    app.use(passport.initialize());// Initialize Passport for authentication
    app.use(passport.session());   // Must be called after Express session()
    // Configure Passport for authentication
    passport.use(new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
      // Look for user in database
      Users.getUser(email).then(function(user) {
        if (user) {
          // If user exists, check their password
          var valid = user.checkPassword(password);
          if (valid) {
            // Success if password valid
            console.log('Valid password');
            return done(null, user);
          }
          else {
            // Failure if password invalid
            console.log('Invalid password');
            return done(null, false, { message: 'Incorrect password.' });
          }
        } else {
          // User didn't exist
          console.log('Invalid email');
          return done(null, false, {message: 'Incorrect email'});
        }
      }).catch(function(error) {
        return done(error);
      });
    }));

    // Serialize user email address into the session.
    passport.serializeUser(function(user, done) {
      done(null, user.email);
    });

    // Deserialize user instance to request.user.
    passport.deserializeUser(function(email, done) {
      Users.getUser(email).then(function(user) {
        done(null, user);
      }).catch(function(error) {
        done(error, null);
      });
    });
  },

  /*
   * Router middleware to make sure a user is logged in.
   *
   * @param {Object} request Express request object.
   * @param {Object} response Express response object.
   * @param {Object} next Next middleware.
   */
  isLoggedIn: function (request, response, next) {
    // If authentication is disabled, continue
    if (!config.get('authentication.enabled')) {
      next();
      return;
    }
    // if user is authenticated in the session, continue
    if (request.isAuthenticated()) {
      return next();
    } else {
      // if they aren't redirect them to the login page
      response.redirect(Constants.LOGIN_PATH);
    }
  }
};
module.exports = Authentication;
