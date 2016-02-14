(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('TokenInjector', ['Token', '$rootScope',
      function(Token, $rootScope) {
        var tokenInjector = {
          request: function(config) {
            var xtoken = Token.get();
            var userid, groupid;
            if (xtoken !== 'undefined' && xtoken !== null) {
              userid = JSON.parse(xtoken) ? true : false;
              groupid = ($rootScope.activeGroup) ? true : false;
              config.headers.access_token = JSON.parse(xtoken).token;
            }
            if (userid) {
              config.headers.userid = JSON.parse(xtoken).user._id;
            }
            if (groupid) {
              config.headers.groupid = $rootScope.activeGroup._id;
            }
            return config;
          }
        };
        return tokenInjector;
      }
    ]);
})();
