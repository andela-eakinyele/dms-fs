(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('featCtrl', ['$mdMedia', '$scope', 'Utils',
      function($mdMedia, $scope, Utils) {

        $scope.$watch(function() {
          return $mdMedia('gt-sm');
        }, function(big) {
          $scope.bigScreen = big;
        });

        // $scope.features = Utils.fetch('data/features.json');
        // console.log($scope.features);
        $scope.features = [{
          "action": true,
          "title": "Start a new Group",
          "content": "Create a new Group for sharing documents with Team members \r" +
            "Add team roles" +
            "for access control "
        }, {
          "title": "Add Team Members/Users",
          "content": "Team members can be added by Admin" +
            "or by Teammates using group authorization code "
        }, {
          "title": "Create and Share Documents",
          "content": "Team members can create and share documents" +
            "with other team members "
        }, {
          "title": "Manage your Documents",
          "content": "Documents are managed by role assignment" +
            "and ownership "
        }];

      }
    ]);
})();
