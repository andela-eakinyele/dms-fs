(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('UserCtrl', ['$rootScope', '$scope', '$mdDialog',
      '$state', '$stateParams', 'Utils', 'Users', 'Roles',
      function($rootScope, $scope, $mdDialog, $state, $stateParams,
        Utils, Users, Roles) {

        $scope.init = function(ev) {
          $scope.data = {};
          $scope.currentGroup = $stateParams.groupid;
          // check user admin privilege
          $scope.userRole = window._.filter($rootScope.activeUser.roles, {
            title: 'Admin',
            groupId: [$scope.currentGroup._id]
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
              console.log(err);
              Utils.showAlert(ev, 'Error Retrieving User',
                $rootScope.activeUser.username);
            });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        // close dialog form
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.roleTitle = function(a, b) {
          return window._.find($scope.roles, {
            '_id': a,
            groupId: [b]
          });
        };

        // update user modal
        $scope.update = function(ev) {
          if ($scope.data.password === 'undefined') {
            delete $scope.data.password;
          }

          Users.update({
            id: $stateParams.id
          }, $scope.data, function() {
            Utils.showAlert(ev, 'Updated User Profile',
              $rootScope.activeUser.username +
              ' \nsuccessfully updated');
          }, function() {
            Utils.showAlert(ev, 'Error Updating User',
              $rootScope.activeUser.username);
          });
        };

      }

    ]);
})();
