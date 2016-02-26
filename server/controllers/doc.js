(function() {
  'use strict';
  var Doc = require('./../models/document');
  var User = require('./../models/user');
  var _ = require('lodash');

  var cm = require('./helpers');

  function getCmp(id, userId, groupId) {
    // query for document
    var queryDoc = Doc.findOne({
      _id: id,
      groupId: [groupId]
    }).populate('ownerId');
    // query for user access
    var queryUser = User.findOne({
      _id: userId
    }).populate('roles');

    return new Promise(function(resolve, reject) {

      cm.gGetOne('Documents', queryDoc, id)
        .then(function(docs) {
          cm.gGetOne('Users', queryUser, userId)
            .then(function(users) {
              if (docs.status !== 400) {
                // find matching role for user and document
                var userRoles = users.data.roles;
                var docRoles = docs.data.roles;
                var matchFind = userRoles.filter(function(value) {
                  return (docRoles.indexOf(value._id)) !== -1;
                });
                resolve([matchFind, docs, users]);
              } else {
                resolve([docs]);
              }
            }).catch(function(errUser) {
              cm.dberrors(reject, 'querying database', errUser, 500);
            });
        }).catch(function(errDoc) {
          cm.dberrors(reject, 'querying database', errDoc, 500);
        });

    });

  }


  var docFunctions = {
    create: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);
      // query for existing document
      var query = Doc.find({
        title: req.body.title
      }).populate('roles');

      req.body.ownerId = userid;
      req.body.groupId = [groupid];
      cm.gCreate('Documents', req.body, Doc, query)
        .then(function(result) {
          // respond with new document details
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });

    },

    all: function(req, res) {
      var page = req.query.page || null;
      var limit = parseInt(req.query.limit) || null;

      var groupid = parseInt(req.headers.groupid);
      var query = Doc.find({})
        .where('groupId').in([groupid])
        .populate('groupId')
        .populate('roles')
        .populate({
          path: 'ownerId',
          select: 'username name'
        });

      if (limit && page) {
        page = parseInt(page) - 1;
        query = query
          .limit(limit)
          .skip(limit * page)
          .sort('dateCreated');
      }

      cm.gGetAll('Documents', query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    count: function(req, res) {
      Doc.count({}, function(err, count) {
        if (err) {
          cm.resdberrors(res, 'querying database', err);
        } else {
          res.status(200).json(count);
        }
      });
    },

    get: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a) {
          if (a[0].status) {
            res.status(a[0].status).json(a[0].data);
          } else if ((a[0].length && !a[0].status) ||
            (a[2].data._id === a[1].data.ownerId[0]._id)) {
            res.status(a[1].status).json(a[1].data);
          } else {
            res.status(403).json({
              'status': 403,
              'message': 'Not authorized to view document',
              'data': []
            });
          }
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });


    },

    update: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a) {
          if (a[0].status) {
            res.status(a[0].status).json(a[0].data);
          } else if (!a[0].status &&
            (a[2].data._id === a[1].data.ownerId[0]._id)) {
            req.body.ownerId = [a[1].data.ownerId[0]._id];
            req.body.lastModified = Date.now();
            var query = Doc.findByIdAndUpdate(req.params.id, req.body, {
              new: true
            });
            cm.gUpdate('Documents', req.params.id, query)
              .then(function(result) {
                res.status(result.status).json(result.data);
              }).catch(function(err) {
                res.status(err.status).json(err.error);
              });
          } else {
            res.status(403).json({
              'status': 403,
              'message': 'Not authorized to update document',
              'data': []
            });
          }
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });

    },

    getDocsById: function(req, res) {
      var ownerId = req.params.id;
      var groupid = req.headers.groupid;
      var args;
      var page = req.query.page || null;
      var limit = parseInt(req.query.limit) || null;

      if (limit && page) {
        page = parseInt(page) - 1;
        args = [limit, page];
      }

      Doc.getDocsByOwnerId(ownerId, groupid, args)
        .then(function(data) {
          res.status(200).json(data);
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    },

    getDocsByIdCount: function(req, res) {
      var ownerId = req.params.id;
      var groupid = req.headers.groupid;

      Doc.getDocsByOwnerIdCount(ownerId, groupid)
        .then(function(data) {
          res.status(200).json(data);
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    },

    delete: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a) {
          if (a[0].status) {
            res.status(a[0].status).json(a[0].data);
          } else if (!a[0].status &&
            a[1].data.roles.length === 0 &&
            a[2].data._id === a[1].data.ownerId[0]._id ||

            (_.pluck(a[2].data.roles, 'title').indexOf('Admin') > -1)) {

            var query = Doc.findByIdAndRemove(req.params.id);
            cm.gDelete('Documents', query, req.params.id)
              .then(function(result) {

                res.status(result.status).json(result.data);
              }).catch(function(err) {
                res.status(err.status).json(err.error);
              });
          } else {
            res.status(403).json({
              'status': 403,
              'message': 'Not authorized to delete document',
              'data': []
            });
          }
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    },

    bulkDelete: function(req, res) {
      var ids = req.query.ids.split(',');
      if (ids.length > 0) {
        Doc.remove({}).where('_id')
          .in(ids)
          .then(function(result) {
            res.status(200).json(result);
          }, function(err) {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({
          error: 'Invalid request'
        });

      }
    },


    bulkView: function(req, res) {
      var ids = req.query.ids.split(',');
      if (ids.length > 0) {
        Doc.find({}).where('_id')
          .in(ids).populate({
            path: 'ownerId',
            select: 'username name _id'
          })
          .then(function(result) {
            res.status(200).json(result);
          }, function(err) {
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({
          error: 'Invalid get request'
        });
      }
    }
  };


  module.exports = docFunctions;
})();
