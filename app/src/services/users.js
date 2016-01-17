(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Users', ['$resource', '$http',
      function userFactory($resource, $http) {
        var obj = $resource('/api/users/:id', {
          id: '@id'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });

        obj.login = function(user, cb) {
          $http.post('/api/users/login', user).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        };
        // obj.session = function(cb) {
        //   $http.get('/api/users/session').success(function(res) {
        //     cb(null, res);
        //   }).error(function(err) {
        //     cb(err);
        //   });
        // };

        // obj.logout = function(cb) {
        //   $http.get('/api/users/logout').success(function(res) {
        //     cb(null, res);
        //   }).error(function(err) {
        //     cb(err);
        //   });
        // };


        return obj;
      }
    ]);

})();
