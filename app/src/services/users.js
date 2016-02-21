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
          $http.post('/api/users/login', user).then(function(res) {
            cb(null, res.data);
          }, function(err) {
            cb(err);
          });
        };

        obj.session = function(cb) {
          $http.get('/api/session').then(function(res) {
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

        return obj;
      }
    ]);

})();
