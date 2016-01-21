(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('ProjectCtrl', ['$rootScope', '$scope', '$state',
      'Projects',
      function($rootScope, $scope, $state, Projects) {
        $scope.init = function() {
          $scope.pform = {};
          $scope.projectErr = '';
        };

        $scope.addProject = function() {
          $scope.pform.roles = $scope.pform.roles.split(', ');
          $scope.pform.roles.push('Admin');

          Projects.save($scope.pform, function(project) {
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
