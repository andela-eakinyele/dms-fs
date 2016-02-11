(function() {
  'use strict';
  angular.module('prodocs.services')
    .factory('TokenInjector', ['Token', '$rootScope',
      function(Token, $rootScope) {
        var tokenInjector = {
          request: function(config) {
            var xtoken = Token.get();

            var userid = JSON.parse(xtoken) ? true : false;
            var groupid = ($rootScope.activeGroup) ? true : false;

            if (xtoken) {
              config.headers.access_token = JSON.parse(xtoken)['token'];
            }
            if (userid) {
              config.headers.userid = JSON.parse(xtoken).user._id;
            }
            if (groupid) {
              console.log($rootScope.activeGroup);

              config.headers.groupid = $rootScope.activeGroup._id;
            }

            return config;
          }
        };
        return tokenInjector;
      }
    ]);
})();
