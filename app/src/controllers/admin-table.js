(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminTableCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Users', 'Roles', 'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, Groups,
        Users, Roles, Docs, Utils) {

        $scope.init = function() {
          $scope.selected = [];

          // set pagination parameters
          $scope.query = $stateParams.query;
        };


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


        // populate user table
        $scope.getGroupUsers = function(query) {

          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });

          function roledata(role) {
            return window._.filter($scope.roles, {
              '_id': role
            });
          }

          var userParams = query;
          userParams.groupid = $stateParams.groupid;

          Users.query(userParams,
            function(res) {
              if (res) {
                var data = res;
                data = window._.map(data, function(a) {
                  window._.forEach(a.roles, function(b) {
                    var role = roledata(b._id);
                    if (role.length) {
                      a.Role = role[0].title;
                    }
                  });
                  return a;
                });

                $scope.users = data;
                Users.count(function(err, count) {
                  if (err) {
                    Utils.showAlert(null, 'Error retrieving ' +
                      'users');
                  } else {
                    $scope.count = count;
                  }
                });
              } else {
                $scope.userErr = 'There are no users in this group';
              }
            },
            function() {
              $scope.userErr = 'Error retrieving group users';
            });
        };

        $scope.userList = function() {

          $scope.listName = 'users';
          $scope.userHeaders = [
            'Username',
            'Email',
            'Firstname',
            'LastName',
            'Role'
          ];
          $scope.init();
          $scope.query.order = 'username';
          $scope.getGroupUsers($scope.query);
        };

        $scope.onPaginateUsers = function(page, limit) {
          $scope.selected = [];
          $scope.getGroupUsers(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate role table
        $scope.getRoles = function(query) {
          var roleParams = query;
          roleParams.groupid = $stateParams.groupid;


          Roles.query(roleParams, function(res) {
            if (res.length > 0) {
              $scope.roles = res;

              Roles.count(function(err, count) {
                if (err) {
                  Utils.showAlert(null, 'Error retrieving ' +
                    'roles');
                } else {
                  $scope.count = count;
                }
              });
            } else {
              $scope.roleErr = 'There are no roles in this group';
            }
          }, function() {
            $scope.roleErr = 'Error retrieving group roles';
          });
        };

        $scope.roleList = function() {
          $scope.init();

          $scope.listName = 'roles';
          $scope.query.order = 'title';

          $scope.roleHeaders = [
            'ID',
            'Title',
            'No of Users'
          ];

          $scope.getRoles($scope.query);
        };

        $scope.onPaginateRole = function(page, limit) {
          $scope.selected = [];
          $scope.getRoles(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate document table
        $scope.getDocs = function(query) {

          var docParams = query;
          docParams.groupid = $stateParams.groupid;

          Docs.query(query, function(res) {
            if (res.length > 0) {
              $scope.docs = res;

              Docs.count(function(err, res) {
                if (err) {
                  Utils.showAlert(null, 'Error retrieving ' +
                    'documents');
                } else {
                  $scope.count = res;
                }
              });
            } else {
              $scope.docErr = 'There are no documents in this group';
            }
          }, function() {
            $scope.docErr = 'Error retrieving group documents';
          });
        };

        $scope.docList = function() {
          $scope.init();
          $scope.listName = 'docs';
          $scope.docHeaders = ['Label', 'Title', 'Owner', 'Date Created', ''];
          $scope.query.order = 'title';
          $scope.getDocs($scope.query);
        };

        $scope.onPaginateDoc = function(page, limit) {
          $scope.selected = [];
          $scope.getDocs(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
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
              } else if ($scope.listName === 'appUsers') {
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
        $scope.getGroups = function(query) {

          Groups.query(query, function(res) {
              if (res.length > 0) {
                $scope.groups = res;

                Groups.count(function(err, res) {
                  if (err) {
                    Utils.showAlert(null, 'Error retrieving ' +
                      'groups');
                  } else {
                    $scope.count = res;
                  }
                });
              } else {
                $scope.groupErr = 'There are no groups';
              }
            },
            function() {
              $scope.groupErr = 'Error retrieving groups';
            });
        };

        $scope.groupList = function() {
          $scope.init();

          $scope.query.order = 'title';

          $scope.listName = 'groups';
          $scope.groupHeaders = [
            'ID',
            'Title',
            'Description',
            'No of Users'
          ];
          $scope.getGroups($scope.query);
        };

        $scope.onPaginateGroup = function(page, limit) {
          $scope.getGroups(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate user table
        $scope.getAppUsers = function(query) {

          Users.query(query, function(res) {
            if (res.length > 0) {
              $scope.allUsers = res;
              Users.count(function(err, res) {
                if (err) {
                  Utils.showAlert(null, 'Error retrieving ' +
                    'users');
                } else {
                  $scope.count = res;
                }
              });
            } else {
              $scope.userErr = 'There are no users';
            }
          }, function() {
            $scope.userErr = 'Error retrieving users';
          });
        };

        $scope.appUsers = function() {
          $scope.init();

          $scope.listName = 'appUsers';
          $scope.userHeaders = [
            'ID',
            'Username',
            'Email',
            'Firstname',
            'LastName',
            'No of Groups'
          ];

          $scope.query.order = 'name.first';
          $scope.getAppUsers($scope.query);
        };


        $scope.onPaginateappUsers = function(page, limit) {
          $scope.selected = [];
          $scope.getGroups(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };


        $scope.refreshTable = function() {
          $scope.selected = [];
          if ($scope.listName === 'users') {
            $scope.getGroupUsers($scope.query);
          } else if ($scope.listName === 'docs') {
            $scope.getDocs($scope.query);
          } else if ($scope.listName === 'roles') {
            $scope.getRoles($scope.query);
          } else if ($scope.listName === 'appUsers') {
            $scope.getAppUsers($scope.query);
          } else if ($scope.listName === 'groups') {
            $scope.getGroups($scope.query);
          }
        };


      }
    ]);

})();
