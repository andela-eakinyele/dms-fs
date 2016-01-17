(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('StartPageCtrl', ['$rootScope', '$scope', 'Users',
      function($rootScope, $scope, Users) {
        $scope.signform = {};
        $scope.isRegistered = false;

        $scope.addUser = function() {
          Users.save($scope.signform, function(user, getResponseHeaders) {
            if (user) {
              $scope.isRegistered = true;
              $scope.responseHeaders = getResponseHeaders;
            }
          });
        };

        $scope.setView = function(viewName) {
          if (viewName === 'login') {
            $scope.login = true;
          }
          if (viewName === 'adduser') {
            $scope.login = true;
          }
        };

        $scope.features = [{
          title: 'Start a new Project',
          img_url: '',
          content: 'Create a new Project for sharing ' +
            'documents with Team members \n' +
            'Add team roles for access control'
        }, {
          title: 'Add Team Members/Users',
          img_url: '',
          content: 'Team members can be added by Admin ' +
            'or by Teammates using project authorization code'
        }, {
          title: 'Create and Share Documents',
          img_url: '',
          content: 'Team members can create and share documents' +
            ' with other team members'
        }, {
          title: 'Manage your Documents',
          img_url: '',
          content: 'Documents are managed by role assignment and owner'
        }];
      }
    ]);
})();
