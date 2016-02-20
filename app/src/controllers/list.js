(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminListCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Users', 'Roles', 'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, Groups,
        Users, Roles, Docs, Utils) {

        $scope.init = function() {
          $scope.selected = [];
        };

        $scope.init();

        // Toggling Selection
        // Update selection  array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        // toggle select all items
        $scope.selectAll = function(items) {
          if ($scope.selected.length > 0) {
            $scope.selected = [];
          } else {
            $scope.selected = window._.map(items, '_id');
          }
        };

        // check item selection state
        $scope.isSelected = function(id, list) {
          return list.indexOf(id) > -1;
        };

        // check select all state
        $scope.all = function(items) {
          if ($scope.selected) {
            return $scope.selected.length === window._.map(items, '_id').length;
          }
          return false;
        };

        // check edit doc access
        $scope.editDoc = function(doc) {
          if (doc && $rootScope.activeUser) {
            return $rootScope.activeUser._id === doc.ownerId[0]._id;
          }
        };

        // Menu button action
        $scope.menuAction = function(ev, id, index, evt) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: id
            });
          }
          if (ev === 'delete') {
            $scope.deleteOne(id, index, evt);
          }
        };

        // format date data
        $scope.getDate = function(date) {
          return Utils.parseDate(date);
        };

        // set pagination parameters
        $scope.query = {
          order: 'Title',
          limit: 5,
          page: 1
        };

        // populate user table
        $scope.userList = function() {
          $scope.listName = 'users';
          $scope.userHeaders = [
            'Username',
            'Email',
            'Firstname',
            'LastName',
            'Role'
          ];

          $scope.query.order = 'FirstName';

          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });

          function roledata(role) {
            return window._.filter($scope.roles, {
              '_id': role
            });
          }

          Groups.get({
              id: $stateParams.groupid
            },
            function(res) {
              if (res) {
                var data = res.users;
                data = window._.map(data, function(a) {
                  window._.forEach(a.roles, function(b) {
                    var role = roledata(b);
                    if (role.length) {
                      a.Role = role[0].title;
                    }
                  });
                  return a;
                });
                $scope.users = data;
              } else {
                $scope.userErr = 'There are no users in this group';
              }
            },
            function() {
              $scope.userErr = 'Error retrieving group users';
            });
        };

        // populate role table
        $scope.roleList = function() {
          $scope.listName = 'roles';

          $scope.roleHeaders = [
            'ID',
            'Title',
            'No of Users'
          ];

          $scope.query.order = 'ID';

          Roles.query({
            groupid: $stateParams.groupid
          }, function(res) {
            if (res.length > 0) {
              $scope.roles = res;
              var data = window._.map($scope.roles, function(a) {
                a.NoOfUsers = a.users.length;
                return a;
              });
              $scope.roles = data;
            } else {
              $scope.roleErr = 'There are no roles in this group';
            }
          }, function() {
            $scope.roleErr = 'Error retrieving group roles';
          });
        };

        // populate document table
        $scope.docList = function() {
          $scope.listName = 'docs';

          $scope.docHeaders = ['Label', 'Title', 'Owner', 'Date Created', ''];

          $scope.query.order = 'Title';

          Docs.query(function(res) {
            if (res.length > 0) {
              $scope.docs = res;
              var data = window._.map($scope.docs, function(a) {
                a.Owner = a.ownerId[0].name.first + ' ' +
                  a.ownerId[0].name.last;
                return a;
              });
              $scope.docs = data;
            } else {
              $scope.docErr = 'There are no documents in this group';
            }
          }, function() {
            $scope.docErr = 'Error retrieving group documents';
          });
        };

        $scope.deleteOne = function(id, index, evt) {
          Utils.showConfirm(evt, 'Delete', 'Selection will be deleted',
            'Delete',
            function() {
              if ($scope.listName === 'docs') {
                Docs.delete({
                    id: id
                  }, function() {
                    $scope.docs.splice(index, 1);
                    Utils.showAlert(evt, 'Delete Action', 'Document ' +
                      'successfully deleted');
                  },
                  function() {
                    Utils.showAlert(evt, 'Delete Action', 'Error Deleting ' +
                      'document');
                  });
              } else if ($scope.listName === 'roles') {
                Roles.delete({
                  id: id
                }, function() {
                  $scope.roles.splice(index, 1);
                  Utils.showAlert(evt, 'Delete Action', 'Role ' +
                    'successfully deleted');
                }, function() {
                  Utils.showAlert(evt, 'Delete Action', 'Error Deleting ' +
                    'document');
                });
              } else if ($scope.listName === 'groups') {
                Groups.delete({
                    id: id
                  }, function() {
                    $scope.groups.splice(index, 1);

                    Utils.showAlert(evt, 'Delete Action', 'Groups ' +
                      'successfully deleted');
                  },
                  function() {
                    Utils.showAlert(evt, 'Delete Action', 'Error Deleting ' +
                      'document');
                  });
              } else if ($scope.listName === 'adminUsers') {
                Users.delete({
                  id: id
                }, function() {
                  $scope.allUsers.splice(index, 1);
                  Utils.showAlert(null, 'Delete Action', 'Users ' +
                    'successfully deleted');
                }, function() {
                  Utils.showAlert(null, 'Delete Action', 'Error Deleting ' +
                    'document');
                });
              }
            });
        };

        // populate group table
        $scope.groupList = function() {
          $scope.listName = 'groups';
          $scope.groupHeaders = [
            'ID',
            'Title',
            'Description',
            'No of Users',
            'No of Roles',
            'No of Documents'
          ];

          $scope.query.order = 'Title';

          Groups.query(function(res) {
              if (res.length > 0) {
                $scope.groups = res;
              } else {
                $scope.groupErr = 'There are no groups';
              }
            },
            function() {
              $scope.groupErr = 'Error retrieving groups';
            });
        };


        // populate user table
        $scope.appUsers = function() {
          $scope.listName = 'adminUsers';
          $scope.userHeaders = [
            'Username',
            'Email',
            'Firstname',
            'LastName',
            'No of Groups'
          ];

          $scope.query.order = 'Title';

          Users.query(function(res) {
            if (res.length > 0) {
              $scope.allUsers = res;
            } else {
              $scope.userErr = 'There are no users';
            }
          }, function() {
            $scope.userErr = 'Error retrieving users';
          });
        };


        $scope.refreshTable = function() {
          $scope.selected = [];
          if ($scope.listName === 'users') {
            $scope.userList();
          } else if ($scope.listName === 'docs') {
            $scope.docList();
          } else if ($scope.listName === 'roles') {
            $scope.roleList();
          } else if ($scope.listName === 'adminUsers') {
            $scope.appUsers();
          }
        };


      }
    ]);

})();
