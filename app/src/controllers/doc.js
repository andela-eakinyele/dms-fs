(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DocCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
      '$timeout', 'Utils', 'Docs', 'Roles',
      function($rootScope, $scope, $state, $stateParams,
        $timeout, Utils, Docs, Roles) {

        $scope.init = function() {
          $scope.newDoc = {};
          $scope.newDoc.roles = [];
          Roles.query({
            groupid: $stateParams.groupid
          }, function(roles) {
            $scope.roles = roles;
          }, function() {
            Utils.showAlert(null, 'Error',
              'Document data could not be retrieved' +
              '\n Please reload page');
          });
        };

        $scope.loadDoc = function() {
          Docs.get({
            id: $stateParams.docId
          }, function(res) {
            $scope.doc = res;
          }, function() {
            Utils.showAlert(null, 'Error',
              'Document could not be retrieved');
          });
        };


        $scope.tinymceOptions = {
          trusted: true,
          resize: false,
          width: '100%',
          min_height: 500,
          plugins: 'textcolor lists autolink link image spellchecker advlist',
          toolbar: 'undo redo styleselect bold italic fontsizeselect' +
            ' forecolor backcolor paste wordcount spellchecker' +
            'alignleft aligncenter alignright',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
          menubar: 'file edit insert view format table tools',
          advlist_bullet_styles: 'square',
          font_formats: 'Arial=arial,helvetica,sans-serif;' +
            ' Courier New=courier new,courier,monospace;' +
            'Robot, Verdana',
          elements: 'elm1',
          theme: 'modern'
        };

        // save a new document
        $scope.saveDoc = function(ev) {
          Docs.save($scope.newDoc, function(res) {
            $state.go('dashboard.doc.view', {
              docId: res._id
            });
          }, function(err) {
            if (err.status === 409) {
              Utils.showAlert(ev, 'Title already Exists - Rename title');
            } else {
              Utils.showAlert(ev, 'Error saving document');
            }
          });
        };

        // update a document
        $scope.updateDoc = function(ev) {
          Docs.update({
            id: $stateParams.docId
          }, $scope.doc, function(res) {
            $state.go('dashboard.doc.view', {
              docId: res._id
            });
          }, function(err) {
            if (err.status === 409) {
              Utils.showAlert(ev, 'Title already Exists - Rename title');
            } else {
              Utils.showAlert(ev, 'Error saving document');
            }
          });
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

        $scope.isSelected = function(role) {
          var checked = $scope.doc ?
            $scope.doc.roles.indexOf(role._id) > -1 : false;
          return checked;
        };

        // Cancel create document, return to dashboard
        $scope.upState = function() {
          $state.go('^');
        };

        $scope.init();

      }

    ]);
})();
