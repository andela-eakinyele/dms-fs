(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('UserCtrl', ['$rootScope', '$scope', '$mdSidenav',
      '$state', '$stateParams', 'Utils', 'Users',
      function($rootScope, $scope, $mdSidenav,
        $state, $stateParams, Utils, Users) {

        $scope.init = function() {
          $scope.data = {};

          // load old user data
          Users.get({
              id: $stateParams.id
            }, function(user) {
              $scope.data = user;
            },
            function() {
              Utils.showAlert(null, 'Error Retrieving User',
                $rootScope.activeUser.username);
            });
        };

        // close sidenav 
        $scope.cancel = function() {
          $rootScope.close('right');
        };

        // update user
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
