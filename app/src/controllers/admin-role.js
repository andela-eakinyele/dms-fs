(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminRoleCtrl', ['$rootScope', '$scope', 'Utils', 'Roles',
      function($rootScope, $scope, Utils, Roles) {

        $scope.num = 0;
        $scope.role = [];
        $scope.newRoles = [];
        $scope.editRoles = [];


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

        $scope.disableCreateButton = function(list) {
          return window._.filter(list, function(a) {
            return a.trim().length > 0;
          }).length === 0;
        };

        $scope.create = function(ev) {
          var gId = parseInt($rootScope.activeGroup._id);
          $scope.newRoles = window._.map($scope.newRoles,
            function(role) {
              return role.trim();
            });
          var saveRoles = $scope.newRoles.map(function(a) {
            return {
              title: a,
              groupId: [gId]
            };
          });
          $scope.newRoles = [];
          Roles.save(saveRoles, function() {
            $scope.loadRoles();
            $scope.cancelAdd();
          }, function() {
            Utils.showAlert(ev, 'Create', 'Error Creating Roles-' +
              ' Check Duplicate Roles');
          });
        };

        $scope.cancelAdd = function() {
          $scope.newRoles = [];
          $scope.num = 0;
        };

        // Update edit roles array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        $scope.deleteRoles = function(ev) {
          var dRole = window._.map($scope.editRoles, '_id');
          Roles.bulkDelete(dRole, function(err) {
            if (err) {
              console.log(err);
            } else {
              $scope.editRoles = [];
              $scope.loadRoles();
              Utils.showAlert(ev, 'Delete', 'Roles successfully deleted');
            }
          });
        };

        $scope.cancelEdit = function() {
          $scope.editRoles = [];
        };

      }
    ]);
})();
