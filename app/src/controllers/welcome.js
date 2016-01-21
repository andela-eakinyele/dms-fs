(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('StartPageCtrl', ['$mdMedia', '$rootScope', '$scope',
      '$state',
      function($mdMedia, $rootScope, $scope, $state) {

        $scope.init = function() {
          $scope.nextView = false;
          $scope.newProject = false;
        };

        $scope.$watch(function() {
          return $mdMedia('gt-sm');
        }, function(big) {
          $scope.bigScreen = big;
        });


        // $scope.bigScreen = $mdMedia('gt-sm');

        $scope.setView = function() {
          $scope.nextView = true;
        };

        $scope.projectNew = function() {
          $scope.newProject = true;
          $scope.nextView = true;
          $state.go('home.project');
        };

        $scope.features = [{
          action: true,
          title: 'Start a new Project',
          content: 'Create a new Project for sharing ' +
            'documents with Team members \n' +
            'Add team roles for access control'
        }, {
          title: 'Add Team Members/Users',
          content: 'Team members can be added by Admin ' +
            'or by Teammates using project authorization code'
        }, {
          title: 'Create and Share Documents',
          content: 'Team members can create and share documents' +
            ' with other team members'
        }, {
          title: 'Manage your Documents',
          content: 'Documents are managed by role assignment ' +
            ' and ownership'
        }];

        $scope.init();

      }
    ]);
})();
