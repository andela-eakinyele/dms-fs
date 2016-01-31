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
    }).populate({
      path: 'role',
      select: 'title'
    });
    return new Promise(function(resolve, reject) {

      cm.gGetOne('Documents', queryDoc, id)
        .then(function(docs) {
          cm.gGetOne('Users', queryUser, userId)
            .then(function(users) {
              if (docs.status !== 400) {
                // find matching role for user and document
                var userRoles = users.data.role;
                var docRoles = docs.data.role;
                var matchFind = userRoles.filter(function(value) {
                  return (docRoles.indexOf(value._id)) !== -1;
                });
                resolve(matchFind, docs, users);
              } else {
                resolve(docs);
              }
            }).catch(function(errUser) {
              cm.dberrors(reject, 'querying database', errUser);
            });
        }).catch(function(errDoc) {
          cm.dberrors(reject, 'querying database', errDoc);
        });
    });

  }


  var docFunctions = {
    create: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);
      // query for existing document
      var query = Doc.find({}).or([{
        title: req.body.title
      }, {
        filename: req.body.filename
      }]);

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
        .then(function(a, b) {
          if (a.length && !a.status) {
            res.status(b.status).json(b);
          } else if (a.status) {
            res.status(a.status).json(a);
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
        .then(function(a, b) {
          if (a.length && !a.status) {

            req.body.ownerId = b.data.ownerId;

            req.body.role = req.body.role.concat(b.role);
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
          } else if (a.status) {
            res.status(a.status).json(a);
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

    // getDocsByOwnerId: function(id) {
    //   var ownerId = id;
    //   return new Promise(function(resolve, reject) {
    //     Doc.getDocsByOwnerId(ownerId).then(function(data) {
    //       if (data.length) {
    //         resolve({
    //           'status': 200,
    //           'message': 'Document for id ' + id,
    //           'data': data
    //         });
    //       }
    //       resolve({
    //         'status': 200,
    //         'message': 'No Document exist for id ' + id,
    //         'data': []
    //       });
    //     }).catch(function(err) {
    //       cm.dberrors(reject, 'querying database', err);
    //     });
    //   });
    // },

    // getDocsByDate: function(date) {
    //   return new Promise(function(resolve, reject) {
    //     Doc.getDocsByDate(date).then(function(data) {
    //       if (data.length) {
    //         resolve({
    //           'status': 200,
    //           'message': 'Document for ' + date,
    //           'data': data
    //         });
    //       } else {
    //         resolve({
    //           'status': 200,
    //           'message': 'No Document exist for date ',
    //           'data': []
    //         });
    //       }
    //     }).catch(function(err) {
    //       cm.dberrors(reject, 'querying database', err);
    //     });
    //   });
    // },

    delete: function(req, res) {
      var userid = parseInt(req.headers.userid),
        groupid = parseInt(req.headers.groupid);

      getCmp(req.params.id, userid, groupid)
        .then(function(a, b, c) {
          if (a.length && !a.status && b.data.role.length === 2 &&
            c.data._id === b.data.ownerId[0] ||
            (_.pluck(c.data.role, 'title').indexOf('Admin') > -1 &&
              _.pluck(c.data.role, 'groupId') === req.headers.groupid)) {
            var query = Doc.findByIdAndRemove(req.params.id);
            cm.gDelete('Documents', query, req.params.id)
              .then(function(result) {
                res.status(result.status).json(result);
              }).catch(function(err) {
                res.status(err.status).json(err);
              });
          } else if (a.status) {
            res.status(a.status).json(a);
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
