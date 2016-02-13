(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('ViewDocCtrl', ['$scope', '$stateParams',
      '$timeout', 'Docs', 'Utils',
      function($scope, $stateParams, $timeout, Docs) {

        $scope.init = function() {
          Docs.get({
            id: $stateParams.docId
          }, function(res) {

            $scope.viewingDoc = res;

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



        $scope.init();
      }
    ]);
})();
