(function() {
  'use strict';
  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var group = require('./groupMethods');
  var Group = require('./../models/group');
  var _ = require('lodash');

  var cm = require('./helpers');


  function rollBack(title, cb) {
    Role.remove({
      title: title
    }).then(function() {
      console.log('Deleted ', title);
      cb(null, true);
      // return error during rollback 
    }, function(err) {
      console.log('Error rolling back role');
      cb(err, null);
    });
  }

  var roleFunctions = {
    bulkCreate: function(req, res) {
      var groupid = parseInt(req.headers.groupid);
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
              Role.collection.insert(req.body, function(err, inserted) {
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
    create: function(req, res) {

      req.body.groupId = [parseInt(req.headers.groupid)];
      // query for existing role
      var query = Role.find({
        title: req.body.title,
        groupId: [parseInt(req.headers.groupid)]
      });
      // create role or return existing role
      cm.gCreate('Roles', req.body, Role, query)
        .then(function(role) {
          // query for group
          var query = {
            _id: req.headers.groupid
          };

          // retrieve group and update with role
          group.retrieveData(query).then(function(gr) {
            if (gr) {
              gr.roles.push(role.data);

              // query for updating group data with new role
              var query2 = Group.findByIdAndUpdate(req.headers.groupid,
                gr, {
                  new: true
                });

              // update group data
              cm.gUpdate('Groups', req.headers.groupid, query2)
                .then(function() {
                  // return status of created role
                  res.status(role.status).json(role);

                  // return error during update and rollback role created
                }).catch(function(err) {
                  rollBack(req.body.title, function(errs) {
                    if (errs) {
                      res.status(500).json(errs);
                    } else {
                      res.status(err.status).json(err);
                    }
                  });
                });

              // group not found
            } else {
              rollBack(req.body.title, function(errs) {
                if (errs) {
                  res.status(500).json(errs);
                } else {
                  res.status(400).json({
                    'status': 400,
                    'message': 'Invalid Group'
                  });
                }
              });
            }
            // return error during group retrieval and rollback
          }).catch(function(err) {
            rollBack(req.body.title, function(errs) {
              if (errs) {
                res.status(500).json(errs);
              } else {
                res.status(err.status).json(err);
              }
            });
          });
          // return error during role create
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    all: function(req, res) {
      var query = Role.find({
        groupId: [parseInt(req.headers.groupid)]
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
          if (data.length) {
            res.status(200).json({
              'status': 200,
              'message': 'Document for role-' +
                req.params.id,
              'data': data
            });
          } else {
            res.status(200).json({
              'status': 200,
              'message': 'No Document exist for role-' +
                req.params.id,
              'data': []
            });
          }
        }).catch(function(err) {
          cm.resdberrors(res, 'querying database', err);
        });
    }

  };

  module.exports = roleFunctions;
})();
