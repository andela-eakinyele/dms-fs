(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('Auth', ['Token', function(Token) {
      return {
        isLoggedIn: function() {
          if (Token.get()[0]) {
            return true;
          } else {
            return false;
          }
        },
        setToken: function(token, groupid) {
          Token.set(token, groupid);
        },

        logout: function() {
          Token.remove();
        }
      };
    }]);
})();
