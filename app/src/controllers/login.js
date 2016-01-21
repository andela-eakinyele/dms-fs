(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$window',
      '$state', '$stateParams', 'Users', 'Auth',

      function($rootScope, $scope, $state, $stateParams, $window, Users, Auth) {


        $scope.loginForm = {};

        $scope.login = function() {
          Users.login({
            username: $scope.loginForm.userdata,
            password: $scope.loginForm.password
          }, function(err, res) {
            console.log(err, res);
            if (err) {
              $state.go('loginerror');
            } else {
              Auth.setToken(res.token);
              $rootScope.activeUser = res;
              $state.go('dashboard', {
                projectId: $scope.loginForm.project
              });
            }
          });
        };


        $state.reload = function reload() {
          console.log($stateParams);
          return $state.transitionTo($state.current, $stateParams, {
            reload: false,
            inherit: false,
            notify: true
          });
        };

        $scope.facebook = function() {
          $window.location.href = '/auth/facebook';
        };

        $scope.google = function() {
          $window.location.href = '/auth/google';
        };

      }
    ]);
})();
