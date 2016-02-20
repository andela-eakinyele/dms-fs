(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('Auth', ['Token', function(Token) {
      return {
        setToken: function(token, groupid) {
          Token.set(token, groupid);
        },

        logout: function() {
          Token.remove();
        }
      };
    }]);
})();
