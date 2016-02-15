(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('TokenInjector', ['Token', '$rootScope',
      function(Token, $rootScope) {
        var tokenInjector = {
          request: function(config) {
            var xtoken = Token.get();
            var definedToken;

            var group = $rootScope.activeGroup;

            if (xtoken[0] !== 'undefined' && xtoken[0] !== null) {
              definedToken = JSON.parse(xtoken[0]) ? true : false;
              config.headers.access_token = JSON.parse(xtoken[0]).token;
            }
            if (definedToken) {
              config.headers.userid = JSON.parse(xtoken[0]).user._id;
              config.headers.groupid = group || xtoken[1] || '';
            }

            return config;
          }
        };
        return tokenInjector;
      }
    ]);
})();
