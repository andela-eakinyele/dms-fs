(function() {
  'use strict';

  var Role = require('./../models/role');
  var Doc = require('./../models/document');
  var User = require('./../models/user');
  var Group = require('./../models/group');
  var cm = require('./helpers'); // common methods

  module.exports = function(req, res) {
    switch (req.params.name) {

      case 'groups':
        Group.count({}, function(err, count) {
          if (err) {
            cm.resdberrors(res, 'querying database', err);
          } else {
            res.status(200).json({
              count: count
            });
          }
        });
        break;

      case 'documents':
        var docGroupId = req.headers.groupid;

        if (docGroupId) {
          Doc.count({
            groupId: parseInt(docGroupId)
          }, function(err, count) {
            if (err) {
              cm.resdberrors(res, 'querying database', err);
            } else {
              res.status(200).json({
                count: count
              });
            }
          });
        } else {
          res.status(400).json({
            error: 'Invalid groupid'
          });
        }
        break;

      case 'roles':
        var groupid = req.query.groupid;

        if (!isNaN(parseInt(groupid))) {

          Role.count({})
            .where('groupId')
            .in([parseInt(groupid)])
            .exec(function(err, count) {
              if (err) {
                cm.resdberrors(res, 'querying database', err);
              } else {
                res.status(200).json({
                  count: count
                });
              }
            });
        } else {
          res.status(400).json({
            error: 'Invalid groupid'
          });
        }
        break;

      case 'users':

        var usersGroupId = req.headers.groupid;

        var query = User.count({});

        if (!isNaN(parseInt(usersGroupId))) {
          query = query
            .where('groupId')
            .in([parseInt(usersGroupId)]);
        }

        query.exec(function(err, count) {
          if (err) {
            cm.resdberrors(res, 'querying database', err);
          } else {
            res.status(200).json({
              count: count
            });
          }
        });
        break;
    }
  };

})();
