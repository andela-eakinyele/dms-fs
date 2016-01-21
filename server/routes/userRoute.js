(function() {
  'use strict';
  var routeMethods = require('./helpers');
  // define create request body
  var bKeys = ['firstname', 'lastname', 'username',
    'password', 'role', 'email', 'projectTitle'
  ];
  // require controller
  var userFunc = require('./../controllers').userFunc;

  var userRoutes = {
    create: function(req, res) {
      // generate object for new user data
      var userData = routeMethods.parseReq(bKeys, req.body);
      userFunc.createUser(userData).then(function(result) {
        res.status(result.status).json(result);
      }).catch(function(err) {
        routeMethods.dberrors(res, 'creating user', err); // db error
      });
    },

    updateUser: function(req, res) {
      var userData = routeMethods.parseReq(bKeys, req.body);
      userFunc.updateUser(userData, req.params.id, req.headers.username)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          routeMethods.dberrors(res, 'updating user', err); // db error
        });
    },

    getUser: function(req, res) {
      userFunc.getUser(req.params.id, req.headers.username)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          routeMethods.dberrors(res, 'getting user', err); // db error
        });
    },

    getAllUsers: function(req, res) {
      userFunc.getAllUsers(req.body.limit).then(function(result) {
        res.status(result.status).json(result);
      }).catch(function(err) {
        routeMethods.dberrors(res, 'getting users', err); // db error
      });
    },

    deleteUser: function(req, res) {
      userFunc.deleteUser(req.params.id, req.headers.username)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          routeMethods.dberrors(res, 'deleting user', err); // db error
        });
    }

  };
  module.exports = userRoutes;
})();
