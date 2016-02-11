(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$rootScope', '$scope', '$mdMedia',
      '$state', '$stateParams', '$mdSidenav', '$timeout', 'Utils', 'Docs',
      'Groups', 'Users', 'Auth', 'Roles', '$mdDialog',
      function($rootScope, $scope, $mdMedia, $state, $stateParams,
        $mdSidenav, $timeout, Utils, Docs, Groups, Users, Auth, Roles,
        $mdDialog) {

        $scope.init = function() {
          $scope.updateForm = {};
          $scope.newDoc = {};
          $scope.currentUser = $rootScope.activeUser;
          $scope.currentGroup = $rootScope.group[0];
          $rootScope.activeGroup = $rootScope.group[0];

          $scope.userRole = window._.filter($scope.currentUser.roles, {
            title: 'Admin',
            groupId: [$scope.currentGroup._id]
          });

          $scope.superAdmin = window._.filter($scope.currentUser.roles, {
            title: 'superAdmin'
          });

          $scope.fabisOpen = false;
          $scope.tooltipVisible = false;
        };

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

        // update user modal
        $scope.updateUserModal = function(ev) {
          var data = {};
          Roles.query({
            groupid: $scope.currentGroup._id
          }, function(role) {
            data.grouproles = role;
          });
          Users.get({
              id: $stateParams.id
            }, function(user) {
              data.user = user;
              // Load Dialog with form template
              Utils.custom(ev, 'Edit Your Profile', 'Save', data,
                'views/update.html',
                function(ans) {
                  if (ans) {
                    $scope.updateForm = ans;

                    // Update user data  
                    Users.update({
                      id: $stateParams.id
                    }, $scope.updateForm, function() {
                      Utils.showAlert(ev, 'Updated User Profile',
                        $scope.currentUser.username +
                        ' \nsuccessfully updated');
                    }, function() {
                      Utils.showAlert(ev, 'Error Updating User',
                        $scope.currentUser.username);
                    });

                    // User cancelled update form
                  } else {
                    $mdDialog.cancel();
                  }
                });
            },
            function() {
              Utils.showAlert(ev, 'Error Retrieving User',
                $scope.currentUser.username);
            });
        };

        $scope.addModel = function() {

        };

        // save a new document
        $scope.saveModel = function(ev, model, data) {
          model.save(data, function(res) {
            Utils.showAlert(ev, 'Successfully saved', res);
          }, function() {
            Utils.showAlert(ev, 'Error saving data');
          });

        };

        // Role data
        $scope.update = function(ev) {
          Users.update($scope.updateForm, function(user) {
            console.log(user);
            Utils.showAlert(ev, 'Updated Document', user.username +
              'successfully updated');
          });

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
            groupid: $scope.currentGroup._id
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
          $rootScope.activeUser = {};
          $rootScope.group = {};
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
              id: $rootScope.activeUser._id
            });
          }
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
          subMenu: $scope.filterExt
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

        // Super admin menu
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


        $scope.init();

      }

    ]);
})();
