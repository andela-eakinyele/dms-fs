(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('LoginCtrl', ['$rootScope', '$scope',
      '$state', '$stateParams', 'Users', 'Auth',

      function($rootScope, $scope, $state, $stateParams,
        Users, Auth) {
        $scope.loginForm = {};
        $scope.loginErr = 'Enter your credentials below';

        $scope.login = function() {
          Users.login({
            username: $scope.loginForm.userdata,
            password: $scope.loginForm.password
          }, function(err, res) {
            if (err) {
              $scope.loginErr = 'Invalid Username/Password';
            } else {
              Auth.setToken(JSON.stringify(res));
              $rootScope.activeUser = res.user;
              if ($rootScope.activeUser.groupId.length > 0) {
                $rootScope.group = res.user.groupId;
                $state.go('dashboard', {
                  id: res.user._id,
                  groupid: res.user.groupId[0]._id
                });
              } else {
                $state.go('home.group', {
                  id: res.user._id
                });
              }
            }
          });
        };
      }
    ]);
})();
