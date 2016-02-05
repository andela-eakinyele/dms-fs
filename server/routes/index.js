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


  // Routes that can be accessed by all users
  router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the Document Management System'
    });
  });

  router.post('/users/login', auth.login);
  router.post('/users', validate.adminUser, userRoute.create);


  // Routes that can be accessed only by authenticated users
  router.all('/*', validate.authenticate);

  router.get('/users', userRoute.all);
  router.route('/users/:id')
    .get(userRoute.get)
    .put(userRoute.update);

  router.route('/groups')
    .get(groupRoute.all)
    .post(groupRoute.create);

  router.route('/groups/:id')
    .put(validate.joinGroup, groupRoute.update)
    .get(groupRoute.get);

  router.route('/documents')
    .get(docRoute.all)
    .post(docRoute.create);
  router.put('/documents/:id', docRoute.update);

  router.get('/roles', roleRoute.all);
  router.get('/roles/:id', roleRoute.get);
  router.get('/roles/:id/documents', roleRoute.getDocsByRole);

  router.get('/users/:id/documents', docRoute.getDocsById);
  router.get('/documents/date', docRoute.getDocsByDate);

  // Routes that require owner/access validation
  router.route('/documents/:id')
    .get(docRoute.get)
    .delete(docRoute.delete);


  router.delete('/users/:id', validate.superAdmin, userRoute.delete);
  router.delete('/groups/:id', validate.superAdmin, groupRoute.delete);


  // Routes that can be accessed only by authenticated and authorized users
  router.all('/*', validate.authorize);

  router.route('/roles')
    .post(roleRoute.create);

  router.route('/roles/:id')
    .put(roleRoute.update)
    .delete(roleRoute.delete);

  module.exports = router;
})();
