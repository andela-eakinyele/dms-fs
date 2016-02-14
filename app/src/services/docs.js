(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Docs', ['$resource', '$http',
      function docFactory($resource, $http) {
        var obj = $resource('/api/documents/:id', {
          id: '@id'
        }, {
          update: {
            // this method issues a PUT request
            method: 'PUT'
          }
        }, {
          stripTrailingSlashes: false
        });

        obj.getUserDocs = function(id, cb) {
          return $http.get('/api/users/' + id + '/documents')
            .then(function(data) {
              cb(null, data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.getRoleDocs = function(id, cb) {
          return $http.get('/api/users/' + id + '/documents')
            .then(function(data) {
              cb(null, data);
            }, function(err) {
              cb(err, null);
            });
        };
        return obj;
      }
    ]);
})();
