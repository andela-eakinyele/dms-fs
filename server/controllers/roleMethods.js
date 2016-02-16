(function() {
  'use strict';
  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var _ = require('lodash');

  var cm = require('./helpers');

  var roleFunctions = {
    bulkCreate: function(req, res) {
      var groupid = parseInt(req.headers.groupid) ||
        parseInt(req.query.groupid);
      var titles = _.pluck(req.body, 'title');
      var bulkData = req.body;
      Role.find({
          groupId: [groupid]
        })
        .where('title').in(titles)
        .exec(function(err, roles) {
          if (roles.length > 0) {
            res.status(400).json(roles);
          } else {
            Role.getMaxId().then(function(data) {
              if (data.length) {
                var nextId = cm.getNextId(data);
              }
              bulkData = _.map(bulkData, function(a, index) {
                a._id = nextId + index;
                return a;
              });
              Role.collection.insert(bulkData, function(err, inserted) {
                if (err) {
                  res.status(400).json(err);
                } else {
                  res.status(201).json(inserted);
                }
              });
            }).catch(function(err) {
              cm.resdberrors(res, 'querying database', err);
            });
          }
        });
    },

    all: function(req, res) {
      var groupid = parseInt(req.headers.groupid) ||
        parseInt(req.query.groupid);
      var query = Role.find({
        groupId: [groupid]
      });
      cm.gGetAll('Roles', query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    get: function(req, res) {
      var query = Role.findOne({
        _id: req.params.id
      }).populate({
        path: 'groupId',
        select: 'title description'
      });
      cm.gGetOne('Roles', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    update: function(req, res) {
      var query = Role.findByIdAndUpdate(req.params.id,
        req.body, {
          new: true
        });
      cm.gUpdate('Roles', req.params.id, query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    delete: function(req, res) {
      var query = Role.findByIdAndRemove(req.params.id);
      cm.gDelete('Roles', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    bulkDelete: function(req, res) {
      Role.remove({})
        .where('_id').in(req.body)
        .exec(function(err, deleted) {
          if (err) {
            res.status(500).json(err.error);
          } else {
            res.status(200).json(deleted);
          }
        });
    },

    getDocsByRole: function(req, res) {
      Doc.getDocsByRole(req.params.id,
          req.headers.groupid)
        .then(function(data) {
          res.status(200).json(data);
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    }

  };

  module.exports = roleFunctions;
})();
