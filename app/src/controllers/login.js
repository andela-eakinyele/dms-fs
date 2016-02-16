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
              $rootScope.activeUser = res.data.user;

              var userGroup = res.data.user.groupId.length > 0;
              if (userGroup) {
                Auth.setToken(JSON.stringify(res.data),
                  res.data.user.groupId[0]._id);
              } else {
                Auth.setToken(JSON.stringify(res.data), '');
              }

              if (userGroup) {
                $rootScope.activeGroup = res.data.user.groupId[0]._id;
                $state.go('dashboard.list', {
                  id: res.data.user._id,
                  groupid: res.data.user.groupId[0]._id
                });

              } else {
                var superAdmin = window._.map(res.data.user.roles, 'title');
                $rootScope.activeGroup = res.data.user.groupId[0]._id;
                if (superAdmin.length > 0) {
                  $state.go('dashboard.admin'.viewdocs, {
                    id: res.data.user._id
                  });
                } else {
                  $state.go('home.group', {
                    id: res.data.user._id
                  });
                }
              }
            }
          });
        };
      }
    ]);
})();
