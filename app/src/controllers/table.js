(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('tableCtrl', ['$scope', '$mdMedia',
      '$mdSidenav', '$timeout', 'Utils', 'Docs',
      function($scope, $mdMedia, $mdSidenav, $timeout, Utils, Docs) {

        $scope.viewing = false;

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        // parse filename to name and extension
        $scope.getExt = function(name) {
          var extStart = name.lastIndexOf('.');
          return {
            name: name.substring(0, extStart),
            ext: name.substring(extStart + 1)
          };
        };


        $scope.testDocs = [{
          name: '1.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '2.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }, {
          name: '3.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '4.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }, {
          name: '5.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '6.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }];

        $scope.filterExt = window._
          .chain($scope.testDocs)
          .map('name')
          .map(function(name) {
            return $scope.getExt(name).ext;
          }).uniq().value();


        $scope.docMenu = [{
          name: 'Edit Doc',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x',
        }];

        $scope.menu = [{
          name: 'User Profile',
          icon: 'fa fa-cog fa-2x',
        }, {
          name: 'Log Out',
          icon: 'fa fa-sign-out fa-2x',
        }];

        $scope.headers = [{
          name: 'FileName',
          field: 'filename'
        }, {
          name: 'Title',
          field: 'title'
        }, {
          name: 'Owner',
          field: 'owner'
        }, {
          name: 'Last Modified',
          field: 'lastModified'
        }, {
          name: 'Shared',
          field: 'shared'
        }, {
          name: 'Type',
          field: 'ext'
        }];


        $scope.userHeaders = [{
          name: 'UserId',
          field: 'id'
        }, {
          name: 'Username',
          field: 'Username'
        }, {
          name: 'Name',
          field: 'fname'
        }, {
          name: 'Joined On',
          field: 'created'
        }, {
          name: 'Role',
          field: 'role'
        }, {
          name: 'No of Docs',
          field: 'docs'
        }, {
          name: 'active',
          field: 'active'
        }];


        $scope.testUsers = [{
          id: 1,
          username: 'Diskit',
          fname: 'Dissin Mockit',
          date: '12-11-1222',
          role: 'Driver',
          num: 50,
          active: false
        }];

        $scope.userMenu = [{
          name: 'Edit User',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x',
        }];


        $scope.roleHeaders = [{
          name: 'RoleId',
          field: 'id'
        }, {
          name: 'Title',
          field: 'title'
        }, {
          name: 'No of Users',
          field: 'users'
        }, {
          name: 'Last Modified',
          field: 'modified'
        }];


        $scope.testRoles = [{
          id: 1,
          title: 'Driver',
          num: 50,
          date: '12-11-1222',
        }];

        $scope.RoleMenu = [{
          name: 'Edit User',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x',
        }];

      }

    ]);
})();
