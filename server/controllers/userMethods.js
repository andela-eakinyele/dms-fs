(function() {
  'use strict';

  var User = require('./../models/user');
  var cm = require('./helpers'); // common methods
  var _ = require('lodash');
  var bcrypt = require('bcrypt-nodejs');


  function superAdmin(id, userid) {
    var query = User.findOne({
      _id: id
    }).populate('roles');

    return new Promise(function(resolve, reject) {
      cm.gGetOne('Users', query, id)
        .then(function(user) {
          if (user) {
            var superAdmin = _.filter(user.data.roles, {
              title: 'superAdmin'
            });
            resolve((superAdmin.length > 0 || userid === id) ? true : false);
          } else {
            resolve(false);
          }
        }).catch(function(err) {
          reject(err);
        });
    });
  }


  var userFunctions = {
    create: function(req, res) {
      // check for existing user data
      var query = User.find({}).or(
          [{
            email: req.body.email
          }, {
            username: req.body.username
          }])
        .select('username name')
        .populate('roles');

      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password);
      }

      cm.gCreate('Users',
          req.body, User, query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    get: function(req, res) {
      var query = User.findOne({
          _id: req.params.id,
          groupId: req.headers.groupid || req.query.groupid
        })
        .select('username email roles name groupId')
        .populate({
          path: 'roles',
          select: 'title _id groupId users'
        })
        .populate({
          path: 'groupId',
          select: 'title description'
        });
      cm.gGetOne('Users', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          console.log(err);
          res.status(err.status).json(err.error);
        });
    },

    update: function(req, res) {
      var query2 = User.findByIdAndUpdate(req.params.id,
          req.body, {
            new: true
          }).select('username email roles name groupId')
        .populate({
          path: 'roles',
          select: 'title _id groupId users'
        })
        .populate({
          path: 'groupId',
          select: 'title description'
        });
      superAdmin(req.params.id, req.headers.userid)
        .then(function(result) {
          if (result) {
            cm.gUpdate('Users', req.params.id, query2)
              .then(function(result) {
                res.status(result.status).json(result.data);
              }).catch(function(err) {
                res.status(err.status).json(err.error);
              });
          } else {
            res.status(403).json({
              'status': 403,
              'message': 'Not authorized to update user',
              'data': []
            });
          }
        });
    },

    all: function(req, res) {
      var query = User.find({
          groupId: req.headers.groupid
        })
        .select('username email roles name')
        .populate({
          path: 'roles',
          select: 'title'
        });
      if (req.params.limit) {
        query = query.limit(req.params.limit);
      }
      cm.gGetAll('Users', query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    delete: function(req, res) {
      var query = User.findByIdAndRemove(req.params.id);
      cm.gDelete('Users', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },


    retrieveData: function(search) {
      var query = User.findOne(search)
        .select('username name email firstname lastname password groupId roles')
        .populate('roles')
        .populate({
          path: 'groupId',
          select: 'users title _id'
        });
      return cm.gFind('Users', query);
    }

  };

  module.exports = userFunctions;
})();
