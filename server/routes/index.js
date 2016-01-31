(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();

  var auth = require('./auth');
  var validate = require('./validate');

  var userRoute = require('./../controllers/userMethods');
  var docRoute = require('./../controllers/docMethods');
  var roleRoute = require('./../controllers/roleMethods');
  var groupRoute = require('./../controllers/groupMethods');

  /*
   Routes that can be accessed by all users
   */
  router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the Document Management System'
    });
  });

  router.post('/users/login', auth.login);

  router.post('/users', validate.adminUser, userRoute.create);

  // /*
  // Routes that can be accessed only by authenticated users
  //  */
  router.all('/*', validate.authenticate);

  router.route('/users/:id')
    .get(userRoute.get)
    .put(userRoute.update);


  router.route('/groups')
    .post(groupRoute.create)
    .get(groupRoute.all);


  router.post('/documents', docRoute.create);
  router.put('/documents/:id', docRoute.update);

  // router.get('/users/:id/documents', docRoute.getDocsById);
  router.get('/users', userRoute.all);
  router.get('/documents', docRoute.all);
  router.get('/roles', roleRoute.all);


  // Routes that require owner/access validation

  router.route('/documents/:id')
    .get(docRoute.get)
    .delete(docRoute.delete);

  // /*
  // Routes that can be accessed only by authenticated and authorized users
  //  */
  router.all('/*', validate.authorize);
  router.delete('/users/:id', userRoute.delete);

  router.route('/roles')
    .post(roleRoute.create);

  router.route('/roles/:id')
    .get(roleRoute.get)
    .put(roleRoute.update)
    .delete(roleRoute.delete);

  // router.get('/roles/:id/documents', roleRoute.getDocsById);
  // router.get('/documents/date', docRoute.getDocsByDate);


  module.exports = router;
})();
