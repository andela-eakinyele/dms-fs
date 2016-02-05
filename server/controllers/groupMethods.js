(function() {
  'use strict';
  var Group = require('./../models/group');
  var User = require('./../models/user');
  var Role = require('./../models/role');
  var user = require('./userMethods');
  var cm = require('./helpers');


  var group = {
    create: function(req, res) {
      var query = Group.find({
        title: req.body.title
      });
      req.body.users = req.body.id || '';

      var query2 = { // query for user data
        _id: req.body.id
      };
      // create a new group
      cm.gCreate('Groups', req.body, Group, query)
        .then(function(result) {
          if (result.status === 201) {
            var query3 = Role.find({
              title: 'Admin',
              groupId: result.data._id
            });
            // create Admin role for new group
            cm.gCreate('Roles', {
                title: 'Admin',
                groupId: result.data._id,
                users: req.body.id || ''
              }, Role, query3)
              .then(function(resRole) {
                // update group data with role id
                var query4 = Group.findByIdAndUpdate(result.data._id, {
                  roles: [resRole.data._id]
                }, {
                  new: true
                });
                cm.gUpdate('Groups', result.data._id, query4)
                  .then(function(newData) {
                    // retrieve user and update group, role with admin for group
                    user.retrieveData(query2).then(function(resUser) {
                      resUser.roles.push(resRole.data._id);
                      resUser.groupId.push(result.data._id);
                      var query5 = User.findByIdAndUpdate(req.body.id,
                        resUser, {
                          new: true
                        });
                      cm.gUpdate('Users', req.body.id, query5)
                        .then(function() {
                          // respond with new group details
                          res.status(newData.status).json(newData);
                        }).catch(function(err) { // error with update user
                          res.status(err.status).json(err);
                        });
                    }).catch(function(err) { // error with retrieve user
                      res.status(err.status).json(err);
                    });
                  }).catch(function(err) { // error with update group
                    res.status(err.status).json(err);
                  });
              }).catch(function(err) { // error with create role
                res.status(err.status).json(err);
              });
          } else { // duplicate group or bad request
            res.status(result.status).json(result);
          }
        }).catch(function(err) { // error with create group
          res.status(err.status).json(err);
        });
    },

    all: function(req, res) {
      var query = Group.find({});
      cm.gGetAll('Groups', query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    get: function(req, res) {
      var query = Group.findOne({
        _id: req.params.id
      });
      cm.gGetOne('Groups', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },


    update: function(req, res) {
      var query = Group.findByIdAndUpdate(req.params.id,
        req.body, {
          new: true
        });
      cm.gUpdate('Groups', req.params.id, query)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
        });
    },

    delete: function(req, res) {
      var query = Group.findByIdAndRemove(req.params.id);
      cm.gDelete('Groups', query, req.params.id)
        .then(function(result) {
          res.status(result.status).json(result);
        }).catch(function(err) {
          res.status(err.status).json(err);
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
