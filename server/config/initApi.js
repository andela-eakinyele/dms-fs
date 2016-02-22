(function() {
  'use strict';

  module.exports = function() {

    var User = require('./../models/user');
    var Role = require('./../models/role');
    var bcrypt = require('bcrypt-nodejs');


    var superRole = {
      title: 'superAdmin',
      users: [100]
    };

    var dummyUser = {
      name: {
        first: 'Dummy',
        last: 'Dummy'
      },
      email: 'dummy@dummy.com',
      password: bcrypt.hashSync(process.env.DUMMY_PASSWORD),
      roles: [],
      _id: 101,
      username: 'Dummy'
    };

    var password = bcrypt.hashSync(process.env.ADMIN_PASSWORD);
    var superAdmin = {
      username: process.env.ADMIN_USERNAME,
      name: {
        first: 'Emmanuel',
        last: 'Akinyele'
      },
      email: 'phoelanre@gmail.com',
      password: password,
      roles: [1]
    };

    function createAdminDummy() {
      Role.create(superRole).then(function() {
        User.create(superAdmin).then(function() {
          User.create(dummyUser).then(function() {
            console.log('Server Initialized');
          }, function(err) {
            console.log('Error Initializing Server', err);
            process.exit(1);
          });
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
        createAdminDummy();
      }
    }, function(err) {
      console.log('Error Initializing Server', err);
      process.exit(1);
    });

  };
})();
