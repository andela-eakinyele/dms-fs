(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Groups', ['$resource', function groupFactory($resource) {
      return $resource('/api/groups/:id', {
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
