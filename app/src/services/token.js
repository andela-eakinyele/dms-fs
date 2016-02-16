(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('Token', ['$window', function($window) {
      return {
        set: function(token, groupid) {
          $window.localStorage.setItem('token', token);
          $window.localStorage.setItem('curGroup', groupid);
        },

        get: function() {
          return [$window.localStorage.getItem('token'),
            $window.localStorage.getItem('curGroup')
          ];
        },

        remove: function() {
          $window.localStorage.removeItem('token');
          $window.localStorage.removeItem('curGroup');
        }
      };
    }]);
})();
