(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Roles', ['$resource', '$http',
      function roleFactory($resource, $http) {
        var obj = $resource('/api/roles/:id', {
          id: '@id',
          groupid: '@groupid',
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

        obj.count = function(cb) {
          return $http.get('/api/rolecount')
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              console.log(err);
              cb(err, null);
            });
        };

        return obj;


      }
    ]);

})();
