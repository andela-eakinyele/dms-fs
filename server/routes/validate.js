(function() {
  'use strict';
  var jwt = require('jwt-simple');
  var _ = require('lodash');
  var bcrypt = require('bcrypt-nodejs');
  var auth = require('./auth');
  var userFunc = require('./../controllers').userFunc;
  var groupFunc = require('./../controllers').groupFunc;

  exports.session = function(req, res) {
    // token is valid
    var query = {
      _id: parseInt(req.headers.userid),
    };
    // retrieve user details
    userFunc.retrieveData(query).then(function(user) {
      if (user) {
        var groupid = req.headers.groupid !== 'undefined' ?
          req.headers.groupid : user.groupId[0]._id;
        res.json({
          data: auth.getToken(user),
          group: groupid
        });
      } else {
        res.status(400).json({
          'status': 400,
          'message': 'User not found',
          'error': 'User does not exist'
        });
      }
    }).catch(function(err) {
      res.status(err.status).json(err.error);
    });
  };


  var authenticate = function(req, res, next) {
    var token = req.headers.access_token || req.params.token;
    if (token) {
      try {
        var decoded = jwt.decode(token,
          require('./../config/secret.js')().encode);
        if (decoded.exp <= Date.now()) {
          res.status(400).json({ // expired token
            'status': 400,
            'message': 'Token/Session Expired, redirect to login',
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
        'message': 'Invalid Token or Key',
        'error': 'Invalid Token'
      });
      return;
    }
  };

  exports.authenticate = authenticate;

  exports.authorize = function(req, res, next) {
    var query = {
      _id: req.headers.userid,
      groupId: req.headers.groupid
    };
    // retrieve user details
    userFunc.retrieveData(query).then(function(user) {
      if (user) {
        var admin = _.filter(user.roles, {
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

  exports.superAdmin = function(req, res, next) {
    var query = {
      _id: req.headers.userid
    };
    // retrieve user details
    userFunc.retrieveData(query).then(function(user) {
      if (user) {
        var superAdmin = _.filter(user.roles, {
          title: 'superAdmin'
        });
        // check for admin role
        if (superAdmin.length) {
          next();
        } else { // user found not superAdmin role for app
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
      res.status(500).json(err);
    });
  };


  exports.adminUser = function(req, res, next) {
    var userRole = req.body.roles ?
      req.body.roles[0].title === 'Admin' : false;
    if (userRole) {
      userFunc.retrieveData({
        _id: req.headers.userid
      }).then(function(user) {
          if (user) {
            var Admin = _.filter(user.roles, {
              title: 'Admin',
              groupId: [req.headers._id]
            });
            // compare group admin and user id
            if (Admin.length > 0) {
              authenticate(req, res, next);
            } else { // userid is not admin
              res.status(403).json({
                'status': 403,
                'message': 'Not authorized to create Admin user',
                'error': 'Unauthorized user action'
              });
            }
          } else {
            res.status(400).json({
              'status': 400,
              'message': 'User is not logged in/does not exists',
              'error': 'User not verified'
            });
          }
        },
        function(err) { // db error
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

  exports.joinGroup = function(req, res, next) {
    var query = {
      _id: req.params.id
    };

    groupFunc.retrieveData(query).then(function(group) {
      if (req.body.users) {
        var validPass = bcrypt.compareSync(req.body.pass, group.passphrase);
        if (validPass) {
          next();
        } else {
          res.status(403).json({
            'status': 403,
            'message': 'Invalid passphrase or non-admin user',
            'error': 'Unauthorized user action'
          });
        }
      } else {
        next();
      }
    }).catch(function(err) {
      res.status(500).json({
        'status': 500,
        'message': 'Database error',
        'error': 'Group not verified ' + err
      });
    });

  };

})();
