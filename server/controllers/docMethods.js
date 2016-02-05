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
      groupId: groupId
    });
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
      });

      req.body.ownerId = userid;
      req.body.groupId = [groupid];
      cm.gCreate('Documents', req.body, Doc, query)
        .then(function(result) {
          // respond with new document details
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });

    },

    all: function(req, res) {
      var groupid = parseInt(req.headers.groupid);
      var query = Doc.find({})
        .where('groupId')
        .in([groupid])
        .populate({
          path: 'ownerId',
          select: 'username'
        }).populate('roles')
        .sort('dateCreated');
      if (req.params.limt) {
        query = query.limit(req.params.limit);
      }
      cm.gGetAll('Documents', query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    get: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a) {
          if (a[0].length && !a[0].status) {
            res.status(a[1].status).json(a[1]);
          } else if (a[0].status) {
            res.status(a[0].status).json(a[0]);
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
          if (a[0].length && !a[0].status) {
            req.body.ownerId = a[1].data.ownerId;
            req.body.lastModified = Date.now();
            var query = Doc.findByIdAndUpdate(req.params.id, req.body, {
              new: true
            });
            cm.gUpdate('Documents', req.params.id, query)
              .then(function(result) {
                res.status(result.status).json(result);
              }).catch(function(err) {
                res.status(err.status).json(err);
              });
          } else if (a[0].status) {
            res.status(a[0].status).json(a[0]);
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
      Doc.getDocsByOwnerId(ownerId).then(function(data) {
        if (data.length) {
          res.status(200).json({
            'status': 200,
            'message': 'Document for id ' + req.params.id,
            'data': data
          });
        } else {
          res.status(200).json({
            'message': 'No Document exist for id ' + req.params.id,
            'data': []
          });
        }
      }).catch(function(err) {
        cm.resdberrors(res, 'querying database', err);
      });
    },

    getDocsByDate: function(req, res) {
      Doc.getDocsByDate(req.query.date).then(function(data) {
        if (data.length) {
          res.status(200).json({
            'status': 200,
            'message': 'Document for ' + req.query.date,
            'data': data
          });
        } else {
          res.status(200).json({
            'status': 200,
            'message': 'No Document exist for date ',
            'data': []
          });
        }
      }).catch(function(err) {
        cm.resdberrors(res, 'querying database', err);
      });
    },

    delete: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a) {
          if (a[0].length && !a[0].status && a[1].data.roles.length === 1 &&
            a[2].data._id === a[1].data.ownerId[0] ||

            (_.pluck(a[2].data.roles, 'title').indexOf('Admin') > -1 &&

              _.pluck(a[2].data.roles, 'groupId') === req.headers.groupid)) {

            var query = Doc.findByIdAndRemove(req.params.id);
            cm.gDelete('Documents', query, req.params.id)
              .then(function(result) {
                res.status(result.status).json(result);
              }).catch(function(err) {
                res.status(err.status).json(err);
              });
          } else if (a[0].status) {
            res.status(a[0].status).json(a[0]);
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

    }
  };

  module.exports = docFunctions;
})();
