(function() {
  'use strict';

  angular.module('prodocs.services')
    .factory('Docs', ['$resource', '$http',
      function docFactory($resource, $http) {
        var obj = $resource('/api/documents/:id', {
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
          return $http.get('/api/documentcount')
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.getUserDocs = function(id, params, cb) {
          return $http.get('/api/users/' + id + '/documents?limit=' +
              params.limit + '&page=' + params.page)
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.getUserDocsCount = function(id, cb) {
          return $http.get('/api/users/' + id + '/documents/count')
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.getRoleDocs = function(id, params, cb) {
          return $http.get('/api/roles/' + id + '/documents?limit=' +
              params.limit + '&page=' + params.page)
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.getRoleDocsCount = function(id, cb) {
          return $http.get('/api/roles/' + id + '/documents/count')
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.bulkdelete = function(data, cb) {
          return $http.delete('/api/documents/bulkdelete?ids=' + data)
            .then(function(res) {
              cb(null, res.data);
            }, function(err) {
              cb(err, null);
            });
        };

        obj.bulkview = function(data, cb) {
          return $http.get('/api/documents/bulkview?ids=' + data)
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
