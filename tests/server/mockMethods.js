(function() {
  'use strict';
  var bcrypt = require('bcrypt-nodejs');
  var _ = require('lodash');
  var User = require('./../../server/models/user');
  var Doc = require('./../../server/models/document');
  var Role = require('./../../server/models/role');
  var Group = require('./../../server/models/group');
  var _async = require('async');


  exports.seedCreate = function(model, keys, seedData, minId) {
    return new Promise(function(resolve, reject) {
      _async.waterfall([
          function(done) {
            var seedResult = [];

            keys.push('_id');
            _async.forEachOf(_.values(seedData), function(data, index, cb) {
              data.push(minId + index);
              var _data = _.zipObject(keys, data);
              if (_data.password) {
                _data.password = bcrypt.hashSync(_data.password);
              }
              if (_data.passphrase) {
                _data.passphrase = bcrypt.hashSync(_data.passphrase);
              }
              model.create(_data)
                .then(function(created) {
                  seedResult.push(created);
                  cb(null, true);
                }, function(err) {
                  cb(err, null);
                });
            }, function(err) {
              if (err) {
                done(err, null);
              } else {
                done(null, seedResult);
              }
            });
          }
        ],
        function(err, res) {
          if (err) {
            reject(err);
          }
          resolve(res);
        });
    });
  };

  exports.seedUpdate = function(model, seedData, seedIds) {
    return new Promise(function(resolve, reject) {
      _async.waterfall([
          function(done) {
            var seedResult = [];

            _async.forEachOf(seedData, function(data, index, cb) {
              model.findByIdAndUpdate(seedIds[index],
                  data, {
                    new: true
                  })
                .then(function(updated) {
                  seedResult.push(updated);
                  cb(null, true);

                }, function(err) {
                  cb(err, null);
                });
            }, function(err) {
              if (err) {
                done(err, null);
              } else {
                done(null, seedResult);
              }
            });
          }
        ],
        function(err, res) {
          if (err) {
            reject(err);
          }
          resolve(res);
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
