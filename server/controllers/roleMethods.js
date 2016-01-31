(function() {
  'use strict';
  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var cm = require('./helpers');


  var roleFunctions = {

    create: function(req, res) {
      var query = Role.find({
        title: req.body.title,
        groupId: req.body.groupId
      });
      cm.gCreate('Roles', req.body, Role, query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    all: function(req, res) {
      var query = Role.find({
        groupId: req.headers.groupid
      });
      cm.gGetAll('Roles', query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    get: function(req, res) {
      var query = Role.findOne({
        _id: req.params.id
      });
      cm.gGetOne('Roles', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    getDocsByRole: function(id, groupId) {
      return new Promise(function(resolve, reject) {
        Doc.getDocsByRole(id, groupId)
          .then(function(data) {
            if (data.length) {
              resolve({
                'status': 200,
                'message': 'Document for role-' + id,
                'data': data
              });
            } else {
              resolve({
                'status': 200,
                'message': 'No Document exist for role-' + id,
                'data': []
              });
            }
          }).catch(function(err) {
            cm.dberrors(reject, 'querying database', err);
          });
      });
    },

    update: function(req, res) {
      var query = Role.findByIdAndUpdate(req.params.id,
        req.body, {
          new: true
        });
      cm.gUpdate('Roles', req.params.id, query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    delete: function(req, res) {
      var query = Role.findByIdAndRemove(req.params.id);
      cm.gDelete('Roles', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    }

  };

  module.exports = roleFunctions;
})();
