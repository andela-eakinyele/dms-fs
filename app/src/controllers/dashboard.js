(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$scope', '$mdMedia',
      '$mdSidenav', '$timeout', 'Utils', 'Docs',
      function($scope, $mdMedia, $mdSidenav, $timeout, Utils, Docs) {

        $scope.viewing = false;

        $scope.newDoc = false;
        $scope.fabisOpen = false;
        $scope.tooltipVisible = false;

        $scope.$watch('fabisOpen', function(isOpen) {
          if (isOpen) {
            $timeout(function() {
              $scope.tooltipVisible = $scope.fabisOpen;
            }, 600);
          } else {
            $scope.tooltipVisible = $scope.fabisOpen;
          }
        });
        // side navigation bar control
        $scope.openLeft = function() {
          $mdSidenav('lefty').toggle();
        };

        $scope.close = function() {
          $mdSidenav('lefty').close();
        };

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        $scope.addDocModal = function(ev, title, answer) {
          Utils.custom(ev, title, answer,
            'views/doc-modal.html',
            function(ans) {
              if (ans === answer) {
                $scope.saveDoc(ev, 'French');
              }
            });
        };


        $scope.saveDoc = function(ev, name) {
          Utils.showAlert(ev, 'Save Document', name +
            'successfully saved');
        };

        $scope.update = function(ev, name) {
          Utils.showAlert(ev, 'Updated Document', name +
            'successfully updated');
        };

        $scope.delete = function(ev, name) {
          Utils.showConfirm(ev, 'Delete Documents', name +
            'will be deleted', 'Delete',
            function() {

            });
        };


        $scope.sideBarMenu = [{
          name: 'View Documents',
          subMenu: ['My Documents', 'Shared Documents']
        }, {
          name: 'FileTypes',
          subMenu: $scope.filterExt
        }];

        $scope.adminSideBarMenu = [
          'List Users', 'List Roles', 'Report'
        ];



        $scope.menu = [{
          name: 'User Profile',
          icon: 'fa fa-cog fa-2x',
        }, {
          name: 'Log Out',
          icon: 'fa fa-sign-out fa-2x',
        }];

        $scope.adminMenu = {
          name: 'Add User/Role',
          icon: 'fa fa-user-plus fa-2x',
          subMenu: [{
            name: 'New Users',
            icon: 'fa fa-user'
          }, {
            name: 'New Role',
            icon: 'fa fa-briefcase'
          }]
        };






      }

    ]);
})();
