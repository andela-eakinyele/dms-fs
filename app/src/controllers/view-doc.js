(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('ViewDocCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', '$timeout', 'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, $timeout,
        Docs, Utils) {

        $scope.init = function() {
          Docs.get({
            id: $stateParams.docId
          }, function(res) {
            $scope.doc = res;
          }, function(err) {
            console.log(err);
            console.log('Error retrieving docs');
          });

          $scope.fabisOpen = false;
          $scope.tooltipVisible = false;

          // check if FAB button is open and show tooltip
          $scope.$watch('fabisOpen', function(isOpen) {
            if (isOpen) {
              $timeout(function() {
                $scope.tooltipVisible = $scope.fabisOpen;
              }, 600);
            } else {
              $scope.tooltipVisible = $scope.fabisOpen;
            }
          });
        };

        // format date data
        $scope.getDate = function(date) {
          return Utils.parseDate(date);
        };


        $scope.editDoc = function() {
          var editable = $scope.doc ?
            $rootScope.activeUser._id === $scope.doc.ownerId[0]._id : false;
          return editable;
        };

        // Menu button action
        $scope.menuAction = function(ev) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: $stateParams.docId
            });
          }
          if (ev === 'delete') {
            Docs.delete({
              id: $stateParams.docId
            }, function() {
              Utils.showAlert(ev, 'Delete Action', 'Document' +
                'successfully deleted');
              $state.reload();
            });
          }
        };

        $scope.init();
      }
    ]);
})();
