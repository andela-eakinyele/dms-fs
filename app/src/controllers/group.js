(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('GroupCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Roles', 'Users',
      function($rootScope, $scope, $state, $stateParams, Groups, Roles, Users) {
        $scope.init = function() {
          $scope.signform = {};
          $scope.pform = {};
          $scope.groupErr = '';
          $scope.newgroup = true;
          $scope.check = [true, false];
          $scope.buttonName = ['Create', 'Join'];
          $scope.groups = Groups.query();
        };

        $scope.toggle = function() {
          $scope.newgroup = !$scope.check[0];
          $scope.joingroup = !$scope.check[1];
          $scope.check[0] = $scope.newgroup;
          $scope.check[1] = $scope.joingroup;
        };

        $scope.getRoles = function() {
          $scope.roles = Roles.query({
            groupid: $scope.signform.group._id
          });
        };

        $scope.addGroup = function() {
          $scope.pform.userid = parseInt($stateParams.id);
          Groups.save($scope.pform, function(group) {
              $scope.groupErr = 'Group saved';
              Users.get({
                id: $rootScope.activeUser._id
              }, function(user) {
                $rootScope.group = user.groupId;
                $state.go('dashboard', {
                  id: $rootScope.activeUser._id,
                  groupid: group._id
                });
              }, function() {
                $scope.groupErr = 'Error retrieving user';
              });
            },
            function() {
              $scope.groupErr = 'Error creating new Group';
            });
        };

        $scope.joinGroup = function() {

          var selectedGroup = $scope.signform.group;
          var selectedRole = $scope.signform.role;
          var newUser = parseInt($stateParams.id);
          var newGroup = $rootScope.activeUser.groupId;
          selectedGroup.users.push(newUser);
          selectedRole.users.push(newUser);
          newGroup.push(selectedGroup._id);

          var groupUpdate = {
            users: window._.uniq(selectedGroup.users),
            pass: $scope.signform.passphrase
          };
          var roleUpdate = {
            users: window._.uniq(selectedRole.users)
          };
          var userUpdate = {
            groupId: newGroup
          };

          Groups.update({
              id: selectedGroup._id
            }, groupUpdate, function() {
              Roles.update({
                id: selectedRole._id
              }, roleUpdate, function() {
                Users.update({
                  id: newUser
                }, userUpdate, function(user) {
                  $scope.groupErr = 'Successfully added to group';
                  $rootScope.group = user.groupId;
                  $state.go('dashboard', {
                    id: $rootScope.activeUser._id,
                    groupid: user.groupId[0]._id
                  });
                }, function() {
                  $scope.groupErr = 'Error updating user';
                });
              }, function() {
                $scope.groupErr = 'Error updating role';
              });
            },
            function() {
              $scope.groupErr = 'Error updating group';
            });
        };

        // initialize
        $scope.init();

      }
    ]);
})();
