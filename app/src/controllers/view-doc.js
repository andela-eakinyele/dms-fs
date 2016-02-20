(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('ViewDocCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', '$timeout', 'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, $timeout,
        Docs, Utils) {

        $scope.init = function() {

          var docIds = $stateParams.docIds;

          if (docIds.length > 0) {
            Docs.bulkview(docIds, function(err, res) {
              if (err) {
                Utils.showAlert(window, 'Retrieve Documents', 'Error ' +
                  'retrieving document');
              } else {
                $scope.docs = res;
              }
            });
          } else {
            Docs.get({
              id: parseInt($stateParams.docId)
            }, function(doc) {
              $scope.docs = [doc];
            }, function() {
              Utils.showAlert(window, 'Retrieve Document', 'Error ' +
                'retrieving document');
            });
          }

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
        $scope.delete = function(evt, id) {
          Utils.showConfirm(evt, 'Delete', 'Document will be deleted', 'Delete',
            function() {
              Docs.delete({
                  id: id
                }, function() {
                  Utils.showAlert(evt, 'Delete Action', 'Document ' +
                    'successfully deleted');
                  $state.go('dashboard.list.mydocs', {
                    id: id,
                    groupid: $stateParams.groupid
                  });
                },
                function() {
                  Utils.showAlert(evt, 'Delete Action', 'Error ' +
                    'deleting document');
                });
            });
        };


        $scope.editDoc = function(doc) {
          var editable = doc ?
            $rootScope.activeUser._id === doc.ownerId[0]._id : false;
          return editable;
        };

        // Menu button action
        $scope.menuAction = function(ev, id, evt) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: id
            });
          }
          if (ev === 'delete') {
            $scope.delete(evt, id);
          }
        };

        $scope.init();
      }
    ]);
})();
