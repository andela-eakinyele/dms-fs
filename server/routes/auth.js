(function() {
  'use strict';
  var jwt = require('jwt-simple');
  var userFunc = require('./../controllers').userFunc;
  var bcrypt = require('bcrypt-nodejs');

  var getToken = function(validuser) {
    var ndate = new Date();
    var sessionLength = 23;
    ndate = ndate.setHours(ndate.getHours() + sessionLength);
    var token = jwt.encode({
      exp: ndate
    }, require('../config/secret')().encode);
    return {
      token: token,
      expires: ndate,
      user: validuser
    };
  };


  var validateDB = function(username, password, cb) {
    var query = {
      'username': username
    };
    userFunc.retrieveData(query).then(function(result) {
      console.log(result);
      if (result) {
        var validPassword = bcrypt.compareSync(password, result.password);
        if (validPassword) {
          result.password = null;
          cb(null, result);
        } else {
          cb(null, false);
        }
      } else {
        cb(null, result);
      }
    }).catch(function(err) {
      cb(err, null);
    });
  };

  var auth = {
    login: function(req, res) {
      // fetch login credentials from request body
      var username = req.body.username || '';
      var password = req.body.password || '';
      // check for empty credentials
      if (username === '' || password === '') {
        res.status(400).json({
          'status': 400,
          'message': 'Invalid credentials'
        });
        return;
      } else { // query data API for valid credentials
        validateDB(username, password, function(err, validuser) {
          if (err) {
            res.json(err);
            return;
          }
          if (validuser) {
            var groupid = validuser.groupId[0] ?
              validuser.groupId[0]._id : '';
            res.status(200).json({
              data: auth.getToken(validuser),
              group: groupid
            });
          } else {
            res.status(400).json({
              'status': 400,
              'message': 'Invalid credentials'
            });
          }
        });
      }
    },

    getToken: getToken

  };

  module.exports = auth;
})();
