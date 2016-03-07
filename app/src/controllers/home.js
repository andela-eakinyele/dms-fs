(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('StartPageCtrl', ['$rootScope', '$scope',
      '$state', '$mdMedia',
      function(rootScope, $scope, $state, $mdMedia) {

        $scope.init = function() {
          $scope.showButton = true;
        };

        // $scope.features = Utils.fetch('data/features.json');
        $scope.features = [{
          'title': 'Sign Up, It\'s Free',
          'content': 'Sign up for a free account, \n' +
            ' Create your own group or Join one'
        }, {
          'title': 'Add Team Members/Users',
          'content': 'Team members can be added by Admin ' +
            'or send them the group passphrase '
        }, {
          'title': 'Create and Share Documents',
          'content': 'Team members can create and share documents ' +
            'with other team members '
        }, {
          'title': 'Manage your Documents',
          'content': 'Documents are managed by role assignment ' +
            'and ownership '
        }];

        $scope.$watch(function() {
          return $state.current.name;
        }, function(name) {
          if (name === 'home.features') {
            $scope.showButton = true;
          } else {
            $scope.showButton = false;
          }
        });

        $scope.init();

      }
    ]);
})();
