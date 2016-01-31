(function() {
  'use strict';
  var jwt = require('jwt-simple');
  var _ = require('lodash');
  var userFunc = require('./../controllers').userFunc;
  var groupFunc = require('./../controllers').groupFunc;


  var authenticate = function(req, res, next) {
    var token = req.headers.access_token;
    if (token) {
      try {
        var decoded = jwt.decode(token, require('./../config/secret.js')());
        if (decoded.exp <= Date.now()) {
          res.status(400).json({ // expired token
            'status': 400,
            'message': 'Token Expired, redirect to login',
            'error': 'Token expired'
          });
          return;
        } else { // token is valid
          next();
        }
      } catch (err) { //error validating token
        res.status(500).json({
          'status': false,
          'message': 'Token not validated',
          'error': err
        });
      }
    } else { // invalid token
      res.status(400).json({
        'status': 400,
        'message': 'Invalid Token or Key'
      });
      return;
    }
  };
  exports.authenticate = authenticate;

  exports.authorize = function(req, res, next) {
    var query = {
      _id: req.headers.userid
    };
    // retrieve user details
    userFunc.retrieveData(query).then(function(user) {
      if (user) {
        var admin = _.filter(user.role, {
          title: 'Admin',
          groupId: [parseInt(req.headers.groupid)]
        });
        // check for admin role
        if (admin.length) {
          next();
        } else { // user found not admin role for group
          res.status(403).json({
            'status': 403,
            'message': 'Not authorized',
            'error': 'Unauthorized user'
          });
        }
      } else { // user not found 
        res.status(400).json({
          'status': 400,
          'message': 'User is not logged in/does not exists',
          'error': 'User not verified'
        });
      }
    }).catch(function(err) {
      res.json(err);
    });
  };

  exports.adminUser = function(req, res, next) {
    var userRole = req.body.role ? req.body.role.title === 'Admin' : false;
    if (userRole) {
      var query = {
        _id: req.body.groupId
      };
      // retrieve group admin user
      groupFunc.retrieveData(query).then(function(group) {
        var adminId = _.filter(group.roles, {
          title: 'Admin'
        });
        // compare group admin and user id
        if (adminId[0].users[0] === parseInt(req.headers.userid)) {
          authenticate(req, res, next);
        } else { // userid is not admin
          res.status(403).json({
            'status': 403,
            'message': 'Not authorized to create Admin user',
            'error': 'Unauthorized user action'
          });
        }
      }, function(err) { // db error
        console.log(err);
        res.status(500).json({
          'status': 500,
          'message': 'Database error',
          'error': 'User not verified ' + err
        });
      });
    } else {
      next();
    }
  };
})();
