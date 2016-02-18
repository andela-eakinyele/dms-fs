(function() {
  'use strict';

  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var User = require('./../models/user');
  var Group = require('./../models/group');
  var cm = require('./helpers'); // common methods
  var _ = require('lodash');
  var _async = require('async');
  var bcrypt = require('bcrypt-nodejs');


  function superAdmin(id, userid) {
    var query = User.findOne({
      _id: userid
    }).populate('roles');

    return new Promise(function(resolve, reject) {
      cm.gGetOne('Users', query, userid)
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


  var cascadeDelete = function(id, cb) {
    _async.waterfall([
      // find all groups with user
      function(done) {
        Group.find()
          .where('users').in([id])
          .then(function(groups) {
            var groupIds = _.map(groups, '_id');
            var data = _.map(groups, function(group) {
              var pos = group.users.indexOf(id);
              group.users.splice(pos, 1);
              return {
                users: group.users
              };
            });
            done(null, data, groupIds);
          }, function(err) {
            done(err, null);
          });
      },

      // update users for all groups
      function(data, groupIds, done) {
        _async.forEachOf(groupIds, function(id, index, cb) {
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

      // find all roles with user
      function(done) {
        Role.find()
          .where('users').in([id])
          .then(function(roles) {
            var roleIds = _.map(roles, '_id');
            var data = _.map(roles, function(role) {
              var pos = role.users.indexOf(id);
              role.users.splice(pos, 1);
              return {
                users: role.users
              };
            });
            done(null, data, roleIds);
          }, function(err) {
            done(err, null);
          });
      },

      // update roles for all documents
      function(data, roleIds, done) {
        _async.forEachOf(roleIds, function(id, index, cb) {
          Role.findByIdAndUpdate(id, data[index], {
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
    ], function(err) {
      if (err) {
        cb(err, null);
      } else {

        // assign dummy owner to user documents
        Doc.collection.update({
          ownerId: {
            $in: [id]
          }
        }, {
          $set: {
            ownerId: [101]
          }
        }, {
          multi: true
        }, function(err) {
          if (err) {
            cb(err, null);
          } else {
            cb(null, {
              success: true
            });
          }
        });
      }
    });
  };

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
      var groupid = req.headers.groupid || req.query.groupid;
      var params = {
        _id: req.params.id
      };
      if (groupid !== undefined && groupid !== '') {
        params.groupId = [parseInt(groupid)];
      }
      var query = User.findOne(params)
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

      var groupid = req.headers.groupid || req.query.groupid;
      var params = {};
      if (groupid !== undefined && groupid !== '') {
        params.groupId = [parseInt(groupid)];
      }
      var query = User.find(params)
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
        .then(function() {
          cascadeDelete(parseInt(req.params.id), function(err, result) {
            if (err) {
              res.status(err.status).json(err);
            } else {
              res.status(200).json(result);
            }
          });
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
