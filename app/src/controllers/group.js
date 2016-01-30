(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('ProjectCtrl', ['$rootScope', '$scope', '$state',
      'Groups',
      function($rootScope, $scope, $state, Groups) {
        $scope.init = function() {
          $scope.pform = {};
          $scope.projectErr = '';
        };

        $scope.addProject = function() {
          $scope.pform.roles = $scope.pform.roles.split(', ');
          $scope.pform.roles.push('Admin');

          Groups.save($scope.pform, function(project) {
            $rootScope.rootProject = project;
            $scope.projectErr = 'Project saved';
            $state.go('home.adduser');
          }, function(err) {
            console.log(err);
            $scope.projectErr = 'Error creating Project';
          });
        };

        // initialize
        $scope.init();

      }
    ]);
})();
