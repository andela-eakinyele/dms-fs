(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('UserCtrl', ['$rootScope', '$scope',
      '$state', '$stateParams', 'Utils', 'Users', 'Roles',
      function($rootScope, $scope, $state, $stateParams,
        Utils, Users, Roles) {

        $scope.init = function() {
          $scope.data = {};
          // check user admin privilege
          $scope.userRole = window._.filter($rootScope.activeUser.roles, {
            title: 'Admin',
            groupId: [$stateParams.groupid]
          });

          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });

          // load old user data
          Users.get({
              id: $stateParams.id
            }, function(user) {
              $scope.data = user;
            },
            function(err) {
              Utils.showAlert(null, 'Error Retrieving User',
                $rootScope.activeUser.username);
            });
        };

        // close sidenav 
        $scope.cancel = function() {
          $rootScope.close('right');
        };

        // update user modal
        $scope.update = function() {
          if ($scope.data.password === 'undefined') {
            delete $scope.data.password;
          }

          $rootScope.activeUser.username = $scope.data.username;
          $rootScope.activeUser.name = $scope.data.name;
          $rootScope.activeUser.email = $scope.data.email;

          Users.update({
            id: $stateParams.id
          }, $scope.data, function() {
            Utils.showAlert(null, 'Updated User Profile',
              $rootScope.activeUser.username +
              ' \nsuccessfully updated');
            $rootScope.close('right');

          }, function() {
            Utils.showAlert(null, 'Error Updating User',
              $rootScope.activeUser.username);
          });
        };

      }

    ]);
})();
