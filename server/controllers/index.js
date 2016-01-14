(function() {
  'use strict';
  var docFunc = require('./docMethods');
  var roleFunc = require('./roleMethods');
  var userFunc = require('./userMethods');

  module.exports = {
    userFunc: userFunc,
    roleFunc: roleFunc,
    docFunc: docFunc
  };
})();
