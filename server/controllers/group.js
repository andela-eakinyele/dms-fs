(function() {
  'use strict';
  var Group = require('./../models/group');
  var User = require('./../models/user');
  var Role = require('./../models/role');
  var user = require('./user');
  var cm = require('./helpers');
  var _async = require('async');
  var _ = require('lodash');
  var bcrypt = require('bcrypt-nodejs');



  var group = {
    create: function(req, res) {
      var query = Group.find({
        title: req.body.title
      });
      req.body.users = [req.body.userid] || [];
      req.body.passphrase = bcrypt.hashSync(req.body.passphrase);

      var query2 = { // query for user data
        _id: req.body.userid
      };
      _async.waterfall([
          // create new group
          function(done) {
            cm.gCreate('Groups', req.body, Group, query)
              .then(function(result) {
                done(null, result);
              }).catch(function(err) { // error with create group
                done(err);
              });
          },

          // create admin role for group
          function(result, done) {
            if (result.status === 201) {
              var query3 = Role.find({
                title: 'Admin',
                groupId: [result.data._id]
              });

              // create Admin role for new group
              cm.gCreate('Roles', {
                  title: 'Admin',
                  groupId: [result.data._id],
                  users: [req.body.userid] || []
                }, Role, query3)
                .then(function(resRole) {
                  done(null, result, resRole);
                })
                .catch(function(err) { // error with create role
                  done(err);
                });
            } else {
              done(result);
            }
          },

          // update group data with role id
          function(result, resRole, done) {
            var query4 = Group.findByIdAndUpdate(result.data._id, {
              roles: [resRole.data._id]
            }, {
              new: true
            });
            cm.gUpdate('Groups', result.data._id, query4)
              .then(function(newData) {
                newData.passphrase = null;
                done(null, result.data._id, resRole.data._id, newData);
              }).catch(function(err) { // error with update group
                done(err);
              });
          },

          // retrieve user and update group, role with admin for group
          function(a, b, c, done) {
            user.retrieveData(query2).then(function(resUser) {

              resUser.roles.push(parseInt(b));
              resUser.groupId.push(parseInt(a));
              done(null, c, resUser);

            }).catch(function(err) { // error with retrieve user
              done(err);
            });
          },

          // update user with group and role id
          function(newData, resUser, done) {

            var query5 = User.findByIdAndUpdate(req.body.userid, {
              roles: resUser.roles,
              groupId: resUser.groupId
            }, {
              new: true
            });
            cm.gUpdate('Users', req.body.userid, query5)
              .then(function() {
                done(null, newData);
              }).catch(function(err) { // error with update user
                done(err);
              });
          }
        ],
        function(err, result) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.status(result.status).json(result.data);
          }
        });
    },

    all: function(req, res) {
      var page = req.query.page || null;
      var limit = parseInt(req.query.limit) || null;

      var query = Group.find({});

      if (limit && page) {
        page = parseInt(page) - 1;
        query = query
          .limit(limit)
          .skip(limit * page)
          .sort('_id');
      }

      cm.gGetAll('Groups', query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    get: function(req, res) {
      var query = Group.findOne({
        _id: req.params.id
      }).populate({
        path: 'users',
        select: 'username name roles email',
      }).populate('roles');
      cm.gGetOne('Groups', query, req.params.id)
        .then(function(result) {
          result.data.passphrase = null;
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },


    update: function(req, res) {
      var query = Group.findByIdAndUpdate(req.params.id,
        req.body, {
          new: true
        });
      cm.gUpdate('Groups', req.params.id, query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    delete: function(req, res) {
      var query = Group.findByIdAndRemove(req.params.id);
      cm.gDelete('Groups', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err.error);
        });
    },

    joinGroup: function(req, res) {

      var userId = parseInt(req.headers.userid);
      var group = req.body[0].group;
      group.users.push(userId);
      var role = req.body[0].role;
      role.users.push(userId);

      var groupUpdate = {
        users: _.uniq(group.users)
      };
      var roleUpdate = {
        users: _.uniq(role.users)
      };

      _async.series([
        function(done) {
          var query = Group.findByIdAndUpdate(group._id,
            groupUpdate, {
              new: true
            });

          cm.gUpdate('Groups', group._id, query)
            .then(function(result) {
              done(null, result);
            }).catch(function(err) {
              done(err, null);
            });
        },

        function(done) {
          var query = Role.findByIdAndUpdate(role._id,
            roleUpdate, {
              new: true
            });

          cm.gUpdate('Roles', role._id, query)
            .then(function(result) {
              done(null, result);
            }).catch(function(err) {
              done(err, null);
            });
        },

        function(done) {
          var query = User.findByIdAndUpdate(userId,
              req.body[1], {
                new: true
              }).select('name roles username groupId')
            .populate({
              path: 'groupId',
              select: 'title roles _id'
            })
            .populate({
              path: 'roles'
            });
          cm.gUpdate('Users', userId, query)
            .then(function(result) {
              done(null, result);
            }).catch(function(err) {
              done(err, null);
            });
        },

      ], function(err, result) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(result[2]);
        }
      });
    },



    retrieveData: function(search) {
      var query = Group.findOne(search)
        .populate('roles users');
      return cm.gFind('Groups', query);
    }

  };
  module.exports = group;
})();
