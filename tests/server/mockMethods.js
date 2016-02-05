(function() {
  'use strict';
  var promise = require('bluebird');
  var _ = require('lodash');
  var User = require('./../../server/models/user');
  var Doc = require('./../../server/models/document');
  var Role = require('./../../server/models/role');
  var Group = require('./../../server/models/group');

  exports.seedCreate = function(model, keys, seedData, minId) {
    keys.push('_id');
    return promise.mapSeries(_.values(seedData), function(data, index) {
      data.push(minId + index);
      return model.create(_.zipObject(keys, data))
        .then(function(created) {
          return created;
        }, function(err) {
          return err;
        });
    });
  };

  exports.seedUpdate = function(model, seedData) {
    return promise.mapSeries(seedData, function(data) {
      return model.findByIdAndUpdate(data._id,
          data, {
            new: true
          })
        .then(function(updated) {
          return updated;
        }, function(err) {
          return err;
        });
    });
  };

  exports.parseData = function(keys, _data) {
    return _.zipObject(keys, _data);
  };

  exports.deleteModels = function(cb) {
    User.remove().exec(function(err) {
      if (err) {
        console.log('Users not removed');
        return;
      }
      Role.remove().exec(function(err) {
        if (err) {
          console.log('Roles not removed');
          return;
        }
        Doc.remove().exec(function(err) {
          if (err) {
            console.log('Users not removed');
            return;
          }
          Group.remove().exec(function(err) {
            if (err) {
              console.log('Groups not removed');
              return;
            }
            cb();
          });
        });
      });
    });
  };
})();
