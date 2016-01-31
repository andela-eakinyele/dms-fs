(function() {
  'use strict';
  var docFunc = require('./docMethods');
  var roleFunc = require('./roleMethods');
  var userFunc = require('./userMethods');
  var groupFunc = require('./groupMethods');


  module.exports = {
    userFunc: userFunc,
    roleFunc: roleFunc,
    docFunc: docFunc,
    groupFunc: groupFunc
  };
})();
