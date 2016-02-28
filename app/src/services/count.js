(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Counts', ['$resource',
      function countFactory($resource) {
        return $resource('/api/count/:name', {
          name: '@name',
          groupid: '@groupid'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });
      }
    ]);

})();
