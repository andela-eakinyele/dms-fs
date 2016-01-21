(function() {
  'use strict';
  var docFunc = require('./docMethods');
  var roleFunc = require('./roleMethods');
  var userFunc = require('./userMethods');
  var projectFunc = require('./projectMethods');


  module.exports = {
    userFunc: userFunc,
    roleFunc: roleFunc,
    docFunc: docFunc,
    projectFunc: projectFunc
  };
})();
