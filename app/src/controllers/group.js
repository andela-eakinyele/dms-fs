(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('GroupCtrl', ['$rootScope', '$scope', '$state',
      'Groups',
      function($rootScope, $scope, $state, Groups) {
        $scope.init = function() {
          $scope.groupForm = {};
          $scope.projectErr = '';
        };

        $scope.addGroup = function() {
          $scope.groupForm.roles = $scope.groupForm.roles.split(', ');
          $scope.groupForm.roles.push('Admin');

          Groups.save($scope.groupForm, function(group) {
            $rootScope.Group = group;
            $scope.groupErr = 'group saved';
            $state.go('home.adduser', {});
          }, function(err) {
            console.log(err);
            $scope.groupErr = 'Error creating Project';
          });
        };

        // initialize
        $scope.init();

      }
    ]);
})();
