(function() {
  'use strict';
  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var User = require('./../models/user');
  var _ = require('lodash');
  var _async = require('async');
  var cm = require('./helpers');

  var cascadeDelete = function(id, cb) {
    _async.waterfall([

      // find all users with role
      function(done) {
        User.find()
          .where('roles').in([id])
          .then(function(users) {
            var userIds = _.map(users, '_id');
            var data = _.map(users, function(user) {
              var pos = user.roles.indexOf(id);
              user.roles.splice(pos, 1);
              return {
                roles: user.roles
              };
            });
            done(null, data, userIds);
          }, function(err) {
            done(err, null);
          });
      },

      // update roles for all users
      function(data, userIds, done) {
        _async.forEachOf(userIds, function(id, index, cb) {
          User.findByIdAndUpdate(id, data[index], {
            new: true
          }).then(function() {
            cb(null, true);
          }, function(err) {
            cb(err, null);
          });
        }, function(err) {
          if (err) {
            done(err, null);
          } else {
            done(null);
          }
        });
      },

      // find all docs with roles
      function(done) {
        Doc.find()
          .where('roles').in([id])
          .then(function(docs) {
            var docsId = _.map(docs, '_id');
            var data = _.map(docs, function(doc) {
              var pos = doc.roles.indexOf(id);
              doc.roles.splice(pos, 1);
              return {
                roles: doc.roles
              };
            });
            done(null, data, docsId);
          }, function(err) {
            done(err, null);
          });
      },

      // update roles for all documents
      function(data, docsId, done) {
        _async.forEachOf(docsId, function(id, index, cb) {
          Doc.findByIdAndUpdate(id, data[index], {
            new: true
          }).then(function() {
            cb(null, true);
          }, function(err) {
            cb(err, null);
          });
        }, function(err) {
          if (err) {
            done(err, null);
          } else {
            done(null, {
              success: true
            });
          }
        });
      }
    ], function(err, result) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, result);
      }
    });
  };




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
      var groupid = req.query.groupid;

      var query = Role.find({});

      var page = req.query.page || null;
      var limit = parseInt(req.query.limit) || null;

      if (!isNaN(parseInt(groupid))) {

        query = query
          .where('groupId')
          .in([parseInt(groupid)]);

        if (limit && page) {
          page = parseInt(page) - 1;
          query = query
            .limit(limit)
            .skip(limit * page)
            .sort('dateCreated');
        }
        cm.gGetAll('Roles', query)
          .then(function(result) {
            res.status(result.status).json(result.data);
          }).catch(function(err) {
            res.status(err.status).json(err.error);
          });
      } else {
        res.status(200).json([{}]);
      }
    },

    count: function(req, res) {

      var groupid = req.query.groupid;

      if (!isNaN(parseInt(groupid))) {

        Role.count()
          .where('groupId')
          .in([parseInt(groupid)])
          .exec(function(err, count) {
            if (err) {
              cm.resdberrors(res, 'querying database', err);
            } else {
              res.status(200).json(count);
            }
          });
      } else {
        res.status(200).json(0);
      }
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
        .then(function() {
          cascadeDelete(parseInt(req.params.id), function(err, result) {
            if (err) {
              res.status(err.status).json(err.error);
            } else {
              res.status(200).json(result);
            }
          });
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },


    getDocsByRole: function(req, res) {
      var args;
      var page = req.query.page || null;
      var limit = parseInt(req.query.limit) || null;

      if (limit && page) {
        page = parseInt(page) - 1;
        args = [limit, page];
      }

      Doc.getDocsByRole(req.params.id,
          req.headers.groupid, args)
        .then(function(data) {
          res.status(200).json(data);
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    },

    getDocsByRoleCount: function(req, res) {
      Doc.getDocsByRoleCount(req.params.id,
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
