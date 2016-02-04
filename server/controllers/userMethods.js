(function() {
  'use strict';

  var User = require('./../models/user');
  var cm = require('./helpers'); // common methods

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

      cm.gCreate('Users',
          req.body, User, query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    get: function(req, res) {
      var query = User.findOne({
          _id: req.params.id,
          groupId: req.query.groupId
        })
        .select('username email role name groupId')
        .populate('roles')
        .populate({
          path: 'groupId',
          select: 'title description'
        });
      cm.gGetOne('Users', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    update: function(req, res) {
      var query = User.findByIdAndUpdate(req.params.id,
        req.body, {
          new: true
        });
      cm.gUpdate('Users', req.params.id, query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    all: function(req, res) {
      var query = User.find({
          groupId: req.headers.groupid
        })
        .select('username email role name')
        .populate({
          path: 'roles',
          select: 'title'
        });
      if (req.params.limit) {
        query = query.limit(req.params.limit);
      }
      cm.gGetAll('Users', query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    delete: function(req, res) {
      var query = User.findByIdAndRemove(req.params.id);
      cm.gDelete('Users', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },


    retrieveAllData: function(search) {
      var query = User.find(search)
        .populate('roles');
      return cm.gFind('Users', query);
    },

    retrieveData: function(search) {
      var query = User.findOne(search)
        .populate('roles')
        .select('username roles name email firstname lastname groupId');
      return cm.gFind('Users', query);
    }

  };

  module.exports = userFunctions;
})();
