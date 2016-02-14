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
              if (res.user.groupId.length > 0) {
                $rootScope.activeGroup = res.user.groupId[0];
                $state.go('dashboard.list', {
                  id: res.user._id,
                  groupid: res.user.groupId[0]._id
                });
              } else {
                var superAdmin = window._.map(res.user.roles, 'title');
                if (superAdmin.length > 0) {
                  $state.go('dashboard.admin', {
                    id: res.user._id
                  });
                } else {
                  $state.go('home.group', {
                    id: res.user._id
                  });
                }
              }
            }
          });
        };
      }
    ]);
})();
