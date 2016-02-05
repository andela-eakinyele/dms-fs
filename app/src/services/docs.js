(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Docs', ['$resource', function docFactory($resource) {
      return $resource('/api/documents/:id', {
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
