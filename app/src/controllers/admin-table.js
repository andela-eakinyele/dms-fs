(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminTableCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Users', 'Roles', 'Docs', 'Utils', 'Auth',
      'Token',
      function($rootScope, $scope, $state, $stateParams, Groups,
        Users, Roles, Docs, Utils, Auth, Token) {

        // initialize variables 
        $scope.init = function() {
          $scope.selected = [];

          $rootScope.close('lefty');

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

        /**
         * Deleting users, documents or roles
         **/
        $scope.deleteOne = function(id, index, evt) {

          // show confirm dialog for every delete operation
          Utils.showConfirm(evt, 'Delete', 'Selection will be deleted',
            'Delete',
            function() {

              // delete request for documents
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

                // delete request for roles
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

                // delete requests for groups
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

                // delete request for users
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

        // deleting multiple selection in tables
        $scope.deleteSelection = function(evt) {
          Utils.showConfirm(evt, 'Delete', 'Documents will be deleted',
            'Delete',
            function() {

              Docs.bulkdelete($scope.selected, function(err) {
                if (err) {
                  Utils.showAlert(evt, 'Delete Action', 'Error ' +
                    'deleting document');
                } else {
                  $scope.docs = window._.filter($scope.docs, function(doc) {
                    return $scope.selected.indexOf(doc._id) < 0;
                  });
                  $scope.count = $scope.count - $scope.selected.length;
                  $scope.selected = [];

                  // re-initialize page
                  $state.go('dashboard.admin.doc', {
                    id: $stateParams.id,
                    groupid: $stateParams.groupid
                  });
                }
              });
            });
        };


        /**
         *Populating tables, pagination, and reloading
         **/

        // populate role table
        $scope.getRoles = function(query) {
          var roleParams = query;
          roleParams.groupid = $stateParams.groupid;

          // request for group roles
          Roles.query(roleParams, function(res) {
            if (res.length > 0) {
              $scope.roles = res;

              // obtain count of roles for pagination
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

        // init function for role view
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

        // invoked for pagination on role table
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

          // request for group documents
          Docs.query(query, function(res) {
            if (res.length > 0) {
              $scope.docs = res;

              // retrieve count for pagination
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

        // initialization for document table view
        $scope.docList = function() {
          $scope.init();
          $scope.listName = 'docs';
          $scope.docHeaders = ['Label', 'Title', 'Owner', 'Date Created', ''];
          $scope.query.order = 'title';
          $scope.getDocs($scope.query);
        };

        // invoked on table pagination
        $scope.onPaginateDoc = function(page, limit) {
          $scope.selected = [];
          $scope.getDocs(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate user table
        $scope.getGroupUsers = function(query) {

          // obtain group role data for parsing user data
          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });

          // get role title based on role id
          function roledata(role) {
            return window._.filter($scope.roles, {
              '_id': role
            });
          }

          var userParams = query;
          userParams.groupid = $stateParams.groupid;

          // request for group users
          Users.query(userParams,
            function(res) {
              if (res.length > 0) {
                var data = res;

                // parsing data corresponing group role title
                data = window._.map(data, function(a) {
                  window._.forEach(a.roles, function(b) {
                    var role = roledata(b._id);
                    if (role.length) {
                      a.Role = role[0].title;
                    }
                  });
                  return a;
                });
                // assign parsed data to scope variable
                $scope.users = data;

                // obatin count of users in group for pagination
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

        // invoked on user view state
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

        // invoked on pagination
        $scope.onPaginateUser = function(page, limit) {
          $scope.selected = [];
          $scope.getGroupUsers(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate group table
        $scope.getGroups = function(query) {

          // request for group data
          Groups.query(query, function(res) {
              if (res.length > 0) {
                $scope.groups = res;

                // request for group count
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

        // invoked on changed state to group view
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

        // invoked on pagination of group table
        $scope.onPaginateGroup = function(page, limit) {
          $scope.selected = [];
          $scope.getGroups(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // populate user table - List of all users
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

        // invoked on loaing superadmin user view
        $scope.appUsers = function() {

          $scope.init();

          $rootScope.activeGroup = '';
          Auth.setToken(Token.get()[0], '');

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

        // invoked on pagination of app users table
        $scope.onPaginateAppUser = function(page, limit) {
          $scope.selected = [];
          $scope.getAppUsers(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        // refresh tables by invoking request functions
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
