(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('GroupCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Roles', 'Users',
      function($rootScope, $scope, $state, $stateParams,
        Groups, Roles, Users) {
        $scope.init = function() {
          // initialize object for forms and checkbox default states
          $scope.signform = {};
          $scope.pform = {};
          $scope.groupErr = '';
          $scope.newgroup = true;
          $scope.check = [true, false];
          $scope.buttonName = ['Create', 'Join'];
          $scope.groups = Groups.query();
        };

        // toggle function for checkboxes
        $scope.toggle = function() {
          $scope.newgroup = !$scope.check[0];
          $scope.joingroup = !$scope.check[1];
          $scope.check[0] = $scope.newgroup;
          $scope.check[1] = $scope.joingroup;
        };

        // retrieve roles based ong group selected
        $scope.getRoles = function() {
          $scope.roles = Roles.query({
            groupid: $scope.signform.group._id
          });
        };

        // create new group by user
        $scope.addGroup = function() {
          $scope.pform.userid = parseInt($stateParams.id);
          Groups.save($scope.pform, function(group) {
            $scope.groupErr = 'Group saved';
            $rootScope.activeGroup = group._id;
            Users.get({ id: $stateParams.id }, function(user) {
                $rootScope.activeUser = user;
                $state.go('dashboard.list', {
                  id: $stateParams.id,
                  groupid: group._id
                });
              },
              function() {
                $scope.groupErr = 'Error creating new Group';
              });
          }, function() {
            $scope.groupErr = 'Error retrieving user';
          });
        };

        // join group by user
        $scope.joinGroup = function() {

          var selectedGroup = $scope.signform.group;
          var selectedRole = $scope.signform.role;

          //  get user document details to be updated
          var _userid = parseInt($stateParams.id);
          var userGroup = $rootScope.activeUser.groupId;
          var _userRoles = window._
            .map($rootScope.activeUser.roles, '_id');

          // update refs with ids
          selectedGroup.users.push(_userid);
          selectedRole.users.push(_userid);
          userGroup.push(selectedGroup._id);
          _userRoles.push(selectedRole._id);

          // update body
          var groupUpdate = {
            users: window._.uniq(selectedGroup.users),
            pass: $scope.signform.passphrase
          };
          var roleUpdate = {
            users: window._.uniq(selectedRole.users)
          };
          var userUpdate = {
            groupId: window._.uniq(userGroup),
            roles: window._.uniq(_userRoles)
          };

          Groups.update({
              id: selectedGroup._id
            }, groupUpdate, function() {
              Roles.update({
                id: selectedRole._id
              }, roleUpdate, function() {
                Users.update({
                  id: _userid
                }, userUpdate, function(user) {
                  console.log(user);
                  $scope.groupErr = 'Successfully added to group';
                  $rootScope.activeUser = user;
                  $rootScope.activeGroup = user.groupId[0]._id;
                  $state.go('dashboard.list', {
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
            function(err) {
              console.log(err);
              if (err.status === 403) {
                $scope.groupErr = 'Invalid Passphrase';
              } else {
                $scope.groupErr = 'Error updating group';
              }
            });
        };

        // initialize
        $scope.init();

      }
    ]);
})();
