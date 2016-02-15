(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$rootScope', '$scope', '$mdMedia',
      '$state', '$stateParams', '$mdSidenav', '$timeout', 'Utils', 'Docs',
      'Groups', 'Users', 'Auth', 'Roles', 'Token',
      function($rootScope, $scope, $mdMedia, $state, $stateParams,
        $mdSidenav, $timeout, Utils, Docs, Groups, Users, Auth, Roles, Token) {

        $scope.init = function() {

          if (!$rootScope.activeUser) {
            $state.go('home.login');
          }
          $scope.groups = $rootScope.activeUser.groupId;

          $scope.updateForm = {};
          $scope.newDoc = {};
          $scope.currentUser = $rootScope.activeUser;
          $rootScope.activeGroup = $stateParams.groupid;

          $scope.userRole = window._.filter($rootScope.activeUser.roles, {
            'groupId': [parseInt($stateParams.groupid)]
          });

          Docs.query(function(res) {
            $scope.allDocs = res;
          }, function(err) {
            console.log(err);
          });
        };

        // Set Selected group
        $scope.toggle = function(id) {
          $rootScope.activeGroup = id;
          Auth.setToken(Token.get()[0], id);
          $state.go($state.current, {
            id: $rootScope.activeUser._id,
            groupid: id
          }, {
            reload: true
          });
        };

        $scope.isSelected = function(id) {
          var checked = $stateParams.groupid ?
            $stateParams.groupid === id : false;
          return checked;
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
              id: $rootScope.activeUser._id
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

        $scope.init();

      }

    ]);
})();
