(function() {
  'use strict';
  module.exports = function() {
    return {
      encode: process.env.ENCODE,
      testAd: {
        user: process.env.ADMIN_USERNAME,
        pw: process.env.ADMIN_PASSWORD
      }
    };
  };
})();
