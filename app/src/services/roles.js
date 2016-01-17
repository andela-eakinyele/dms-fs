(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('roles', ['$resource', function roleFactory($resource) {
      return $resource('/api/roles/:id', {
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
