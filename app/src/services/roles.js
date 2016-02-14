(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Roles', ['$resource', '$http',
      function roleFactory($resource, $http) {
        var obj = $resource('/api/roles/:id', {
          id: '@id',
          groupId: '@groupid'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });

        obj.bulkDelete = function(roles, cb) {
          $http.post('/api/roles/delete', roles).success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
        };

        return obj;

      }
    ]);

})();
