(function() {
  'use strict';
  var Group = require('./../models/group');
  var User = require('./../models/user');
  var Role = require('./../models/role');
  var user = require('./userMethods');
  var cm = require('./helpers');
  var _async = require('async');
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
                done(null, result, resRole, newData);
              }).catch(function(err) { // error with update group
                done(err);
              });
          },

          // retrieve user and update group, role with admin for group
          function(result, resRole, newData, done) {
            user.retrieveData(query2).then(function(resUser) {
              resUser.roles.push(resRole.data._id);
              resUser.groupId.push(result.data._id);
              done(null, newData, resUser);

            }).catch(function(err) { // error with retrieve user
              done(err);
            });
          },
          function(newData, resUser, done) {
            var query5 = User.findByIdAndUpdate(req.body.userid,
              resUser, {
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
            console.log(err);
            res.status(500).json(err);
          } else {
            res.status(result.status).json(result.data);
          }
        });
    },

    all: function(req, res) {
      var query = Group.find({});
      cm.gGetAll('Groups', query)
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          console.log(err);
          res.status(err.status).json(err.error);
        });
    },

    get: function(req, res) {
      var query = Group.findOne({
        _id: req.params.id
      }).populate({ path: 'users', select: 'username name roles email' });
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



    retrieveData: function(search) {
      var query = Group.findOne(search)
        .populate('roles users');
      return cm.gFind('Groups', query);
    }

  };
  module.exports = group;
})();
