(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Users', ['$resource', '$http',
      function userFactory($resource, $http) {
        var obj = $resource('/api/users/:id', {
          id: '@id',
          page: '@page',
          limit: '@limit'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });

        obj.login = function(user, cb) {
          return $http.post('/api/users/login', user).then(function(res) {
            cb(null, res.data);
          }, function(err) {
            cb(err);
          });
        };

        obj.session = function(cb) {
          return $http.get('/api/session').then(function(res) {
            cb(null, res.data);
          }, function(err) {
            cb(err);
          });
        };

        obj.count = function(cb) {
          return $http.get('/api/usercount')
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.joingroup = function(data, cb) {
          return $http.post('/api/groups/join', data).then(function(res) {
            cb(null, res.data);
          }, function(err) {
            cb(err);
          });
        };

        return obj;
      }
    ]);

})();
