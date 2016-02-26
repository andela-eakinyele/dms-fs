(function() {
  'use strict';
  var promise = require('bluebird');
  var bcrypt = require('bcrypt-nodejs');
  var _ = require('lodash');
  var User = require('./../../../server/models/user');
  var Doc = require('./../../../server/models/document');
  var Role = require('./../../../server/models/role');
  var Group = require('./../../../server/models/group');

  exports.seedCreate = function(model, keys, seedData, minId) {
    keys.push('_id');
    return promise.mapSeries(_.values(seedData), function(data, index) {
      data.push(minId + index);
      var _data = _.zipObject(keys, data);
      if (_data.password) {
        _data.password = bcrypt.hashSync(_data.password);
      }
      if (_data.passphrase) {
        _data.passphrase = bcrypt.hashSync(_data.passphrase);
      }
      return model.create(_data)
        .then(function(created) {
          return created;
        }, function(err) {
          return err;
        });
    });
  };

  exports.seedUpdate = function(model, seedData, seedIds) {
    return promise.mapSeries(seedData, function(data, index) {
      return model.findByIdAndUpdate(seedIds[index],
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
