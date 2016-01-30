(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Groups', ['$resource', function roleFactory($resource) {
      return $resource('/api/projects/:id', {
        id: '@id'
      }, {
        update: {
          // this method issues a PUT request
          method: 'PUT'
        }
      }, {
        stripTrailingSlashes: false
      });
    }]);

})();
