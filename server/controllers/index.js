(function() {
  'use strict';
  var docFunc = require('./doc');
  var roleFunc = require('./role');
  var userFunc = require('./user');
  var groupFunc = require('./group');


  module.exports = {
    userFunc: userFunc,
    roleFunc: roleFunc,
    docFunc: docFunc,
    groupFunc: groupFunc
  };
})();
