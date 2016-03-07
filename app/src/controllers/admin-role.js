(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminRoleCtrl', ['$rootScope', '$scope',
      '$state', '$stateParams', 'Utils', 'Roles',
      function($rootScope, $scope, $state, $stateParams, Utils, Roles) {

        // initialize scope variables
        $scope.num = 3;
        $scope.newRoles = [];

        // returns an array for repeating role inout field
        $scope.range = function(num) {
          return new Array(num);
        };

        // increase number of input field
        $scope.increase = function() {
          $scope.num += 1;
        };

        // decease number of input field
        $scope.decrease = function() {
          $scope.num -= 1;
          $scope.newRoles.pop();
        };

        // check input fields are not empty
        $scope.enableCreateButton = function(list) {
          if (list.length > 0) {
            return window._.every(list, function(a) {
              [0].length
              return a ? a.trim().length > 0 : false;
            });
          } else {
            return false;
          }
        };

        // create roles
        $scope.create = function(ev) {
          var gId = parseInt($stateParams.groupid);

          // generate sorted unique values for roles
          $scope.newRoles = window._.sortedUniq(
            window._.map($scope.newRoles,
              function(role) {
                return role.trim();
              }));

          // generate array of objects for bulk creation of roles
          $scope.saveRoles = $scope.newRoles.map(function(a) {
            return {
              title: a,
              groupId: [gId]
            };
          });

          // post request to server for roles creation
          Roles.save($scope.saveRoles, function() {
            $scope.cancelAdd(); // reset input fields
            $state.go('dashboard.admin.role', {
              id: $stateParams.id,
              groupid: $stateParams.groupid
            }, {
              reload: true
            });
          }, function() { // alert error encountered creating roles
            Utils.showAlert(ev, 'Create', 'Error Creating Roles-' +
              ' Check Duplicate/Empty Roles');
          });
        };

        // reset input fields and go to role dashboard view 
        $scope.cancelAdd = function() {
          $scope.newRoles = [];
          $scope.num = 2;
          $state.go('dashboard.admin.role', {
            id: $stateParams.id,
            groupid: $stateParams.groupid
          }, {
            reload: true
          });
        };

      }
    ]);
})();
