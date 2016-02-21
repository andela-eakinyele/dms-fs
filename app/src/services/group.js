(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Groups', ['$resource', '$http',
      function groupFactory($resource, $http) {
        var obj = $resource('/api/groups/:id', {
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

        obj.count = function(cb) {
          return $http.get('/api/groupcount')
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
