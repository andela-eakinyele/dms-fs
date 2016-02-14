(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DocCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
      'Utils', 'Docs', 'Roles',
      function($rootScope, $scope, $state, $stateParams,
        Utils, Docs, Roles) {

        $scope.init = function() {
          $scope.newDoc = {};
          $scope.newDoc.roles = [];
          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });
        };

        // save a new document
        $scope.saveDoc = function(ev) {
          console.log($scope.newDoc);
          Docs.save($scope.newDoc, function(res) {
            Utils.showAlert(ev, 'Successfully saved', res.title);
          }, function(err) {
            if (err.status === 409) {
              Utils.showAlert(ev, 'Title already Exists - Rename title');
            } else {
              Utils.showAlert(ev, 'Error saving document');
            }
          });

          // Up
          $scope.update = function(ev) {
            Docs.update($scope.updateForm, function(user) {
              Utils.showAlert(ev, 'Updated Document', user.username +
                'successfully updated');
            });
          };
        };

        // Update shared roles array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        // Cancel create document, return to dashboard
        $scope.upState = function() {
          $state.go('^');
        };

        $scope.init();

      }

    ]);
})();
