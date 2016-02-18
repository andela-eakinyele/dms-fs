(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Roles', ['$resource', '$http',
      function roleFactory($resource, $http) {
        var obj = $resource('/api/roles/:id', {
          id: '@id',
          groupid: '@groupid'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });

        obj.bulkDelete = function(roles, cb) {
          $http.post('/api/roles/delete', roles).then(function(res) {
            cb(null, res.data);
          }, function(err) {
            cb(err);
          });
        };

        return obj;

      }
    ]);

})();
