(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('featCtrl', ['$mdMedia', '$scope',
      function($mdMedia, $scope) {

        $scope.init = function() {
          console.log('test');
          $scope.bigScreen = $mdMedia('gt-sm');
          console.log($scope.bigScreen);

        };

        $scope.$watch(function() {
          return $mdMedia('gt-sm');
        }, function(big) {
          $scope.bigScreen = big;
        });

        // $scope.features = Utils.fetch('data/features.json');
        // console.log($scope.features);
        $scope.features = [{
          'title': 'Sign Up, It\'s Free',
          'content': 'Sign up for a free account, \n' +
            ' Create your own group or Join one'
        }, {
          'title': 'Add Team Members/Users',
          'content': 'Team members can be added by Admin' +
            'or send them the group passphrase '
        }, {
          'title': 'Create and Share Documents',
          'content': 'Team members can create and share documents' +
            'with other team members '
        }, {
          'title': 'Manage your Documents',
          'content': 'Documents are managed by role assignment' +
            'and ownership '
        }];

      }
    ]);
})();
