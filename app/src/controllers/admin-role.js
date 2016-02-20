(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminRoleCtrl', ['$rootScope', '$scope',
      '$state', '$stateParams', 'Utils', 'Roles',
      function($rootScope, $scope, $state, $stateParams, Utils, Roles) {

        $scope.num = 0;
        $scope.newRoles = [];

        $scope.range = function(num) {
          return new Array(num);
        };

        $scope.increase = function() {
          $scope.num += 1;
        };

        $scope.decrease = function() {
          $scope.num -= 1;
        };

        $scope.enableCreateButton = function(list) {
          return window._.every(list, function(a) {
            return a ? a.trim().length > 0 : false;
          });
        };

        $scope.create = function(ev) {
          var gId = parseInt($stateParams.groupid);

          $scope.newRoles = window._.map($scope.newRoles,
            function(role) {
              return role.trim();
            });

          $scope.saveRoles = $scope.newRoles.map(function(a) {
            return {
              title: a,
              groupId: [gId]
            };
          });

          $scope.newRoles = [];

          Roles.save($scope.saveRoles, function() {
            $scope.cancelAdd();
            $state.go('dashboard.admin.role', {
              id: $stateParams.id,
              groupid: $stateParams.groupid
            }, {
              reload: true
            });
          }, function() {
            Utils.showAlert(ev, 'Create', 'Error Creating Roles-' +
              ' Check Duplicate Roles');
          });
        };

        $scope.cancelAdd = function() {
          $scope.newRoles = [];
          $scope.num = 0;
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
