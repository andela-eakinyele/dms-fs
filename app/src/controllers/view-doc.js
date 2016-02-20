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
          }, function() {
            Utils.showAlert(null, 'Error', 'Error retrieving document');
            $state.go('dashboard.list.mydocs');
          });

          $scope.fabisOpen = false;
          $scope.tooltipVisible = false;

          // check if FAB button is open and show tooltip
          $scope.$watch('fabisOpen', function(isOpen) {
            if (isOpen) {
              $scope.tooltipVisible = $scope.fabisOpen;
            } else {
              $scope.tooltipVisible = $scope.fabisOpen;
            }
          });
        };

        // format date data
        $scope.getDate = function(date) {
          return Utils.parseDate(date);
        };

        // delete a Document/Role/User
        $scope.delete = function(evt) {
          Utils.showConfirm(evt, 'Delete', 'Document will be deleted', 'Delete',
            function() {
              Docs.delete({
                  id: $stateParams.docId
                }, function() {
                  Utils.showAlert(evt, 'Delete Action', 'Document ' +
                    'successfully deleted');
                  $state.go('dashboard.list.mydocs', {
                    id: $stateParams.id,
                    groupid: $stateParams.groupid
                  });
                },
                function() {
                  Utils.showAlert(evt, 'Delete Action', 'Error ' +
                    'deleting document');
                });
            });
        };


        $scope.editDoc = function() {
          var editable = $scope.doc ?
            $rootScope.activeUser._id === $scope.doc.ownerId[0]._id : false;
          return editable;
        };

        // Menu button action
        $scope.menuAction = function(ev, evt) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: $stateParams.docId
            });
          }
          if (ev === 'delete') {
            $scope.delete(evt);
          }
        };

        $scope.init();
      }
    ]);
})();
