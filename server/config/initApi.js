(function() {
  'use strict';

  module.exports = function() {

    var User = require('./../models/user');
    var Role = require('./../models/role');

    var superRole = {
      title: 'superAdmin',
      users: [100]
    };

    var superAdmin = {
      username: process.env.ADMIN_USERNAME,
      name: {
        first: 'Emmanuel',
        last: 'Akinyele'
      },
      email: 'phoelanre@gmail.com',
      password: process.env.ADMIN_PASSWORD,
      roles: [1]
    };

    function createAdmin() {
      Role.create(superRole).then(function() {
        User.create(superAdmin).then(function() {
          console.log('Server Initialized');
        }, function(err) {
          console.log('Error Initializing Server', err);
          process.exit(1);
        });
      }, function(err) {
        console.log('Error Initializing Server', err);
        process.exit(1);
      });
    }

    Role.findOne({
      title: 'superAdmin'
    }).populate({
      path: 'users',
      select: 'username'
    }).then(function(role) {
      if (role && role.users[0].username === process.env.ADMIN_USERNAME) {
        console.log('Server Initialized');
      } else {
        createAdmin();
      }
    }, function(err) {
      console.log('Error Initializing Server', err);
      process.exit(1);
    });

  };
})();
