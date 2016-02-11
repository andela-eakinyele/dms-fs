(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminCtrl', ['$rootScope', '$scope', '$mdMedia',
      '$state', '$stateParams', '$mdSidenav', '$timeout', 'Utils', 'Docs',
      'Groups', 'Users', 'Auth', 'Roles', '$mdDialog',
      function($rootScope, $scope, $mdMedia, $state, $stateParams,
        $mdSidenav, $timeout, Utils, Docs, Groups, Users, Auth, Roles,
        $mdDialog) {

        $scope.num = 0;
        $scope.role = [];
        $scope.newRoles = [];

        // Load roles in a group
        $scope.loadRoles = function() {
          Roles.query({
            groupid: $rootScope.activeGroup._id
          }, function(role) {
            $scope.roles = role;
          });
        };

        $scope.range = function(num) {
          return new Array(num);
        };

        $scope.increase = function() {
          $scope.num += 1;
        };

        $scope.decrease = function() {
          $scope.num -= 1;
        };

        $scope.create = function() {
          var gId = parseInt($rootScope.activeGroup._id);
          var saveRoles = $scope.newRoles.map(function(a) {
            return {
              title: a,
              groupId: [gId]
            };
          });
          Roles.save(saveRoles, function(res) {
            $scope.roles.push(res);
          }, function() {
            $scope.newErr = 'Error Creating Roles';
          });
        };


        $scope.cancelEdit = function() {
          $scope.editRoles.forEach(function(a) {
            a.checked = false;
          });
        };

        $scope.cancelAdd = function() {
          $scope.newRoles = [];
          $scope.num = 0;
        };


      }
    ]);
})();
