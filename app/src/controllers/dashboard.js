(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$rootScope', '$scope', '$mdMedia',
      '$state', '$stateParams', '$mdSidenav', '$timeout', 'Utils', 'Docs',
      'Groups', 'Users', 'Auth', 'Roles', 'activeUser', 'activeGroup',
      function($rootScope, $scope, $mdMedia, $state, $stateParams,
        $mdSidenav, $timeout, Utils, Docs, Groups, Users, Auth, Roles,
        activeUser, activeGroup) {

        $scope.init = function() {
          console.log(activeGroup);
          $scope.updateForm = {};
          $scope.newDoc = {};
          $scope.currentUser = activeUser;

          $scope.superAdmin = window._.filter(activeUser.roles, {
            title: 'superAdmin'
          });

          if (activeGroup) {
            $scope.userRole = window._.filter(activeUser.roles, {
              title: 'Admin',
              groupId: [activeGroup._id]
            });
          }

          Docs.query(function(res) {
            $scope.allDocs = res;
            $scope.label = window._.uniq(window._.map($scope.allDocs, 'label'));
            // Side bar navigation menu
            $scope.sideBarMenu = [{
              name: 'Group Documents',
              subMenu: ['My Documents', 'Shared Documents']
            }, {
              name: 'Labels',
              subMenu: $scope.label
            }];
          }, function(err) {
            console.log(err);
          });
        };

        $scope.setActiveGroup = function() {
          $rootScope.activeGroup = $scope.setGroup;
          console.log('reset');
          $scope.init();
        };



        // Load Dialog with form template
        $scope.updateUserModal = function(ev) {
          Utils.custom(ev,
            'views/update.html', 'UserCtrl');
        };

        // delete a Document/Role/User
        $scope.delete = function(ev, name) {
          Utils.showConfirm(ev, 'Delete Documents', name +
            'will be deleted', 'Delete',
            function() {});
        };

        // Load roles in a group
        $scope.loadRoles = function() {
          Roles.query({
            groupid: $stateParams.groupid
          }, function(role) {
            $scope.roles = role;
          });
        };

        // Cancel create document, return to dashboard
        $scope.upState = function() {
          $state.go('^');
        };

        // Log out user and delete token
        $scope.logout = function() {
          $rootScope.activeUser = null;
          $rootScope.activeGroup = null;
          Auth.logout();
          $state.go('home.features');
        };

        // Menu button action
        $scope.menuAction = function(ev) {
          if (ev === 'logout') {
            $scope.logout();
          }
          if (ev === 'Set') {
            $scope.updateUserModal();
          }
          if (ev === 'Join') {
            $state.go('home.group', {
              id: activeUser._id
            });
          }
        };

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

        // Side bar navigation menu
        $scope.sideBarMenu = [{
          name: 'View Documents',
          subMenu: ['My Documents', 'Shared Documents']
        }, {
          name: 'Labels',
          subMenu: $scope.label
        }];

        $scope.adminSideBarMenu = [
          'List Users', 'List Roles', 'Report'
        ];

        // Header menu
        $scope.menu = [{
          name: 'Join Group',
          icon: 'fa fa-group fa-2x',
          click: 'Join'
        }, {
          name: 'User Profile',
          icon: 'fa fa-cog fa-2x',
          click: 'Set'
        }, {
          name: 'Log Out',
          icon: 'fa fa-sign-out fa-2x',
          click: 'logout'
        }];

      }

    ]);
})();
