(function() {
  'use strict';
  var Project = require('./../models/project');
  var cMthds = require('./helpers');
  var projectKeys = ['title', 'roles'];

  var projectFunction = {
    createProject: function(title) {
      var projectData = cMthds.parseData(projectKeys, title);
      var query = Project.find({
        title: projectData.title
      });
      return cMthds.gCreate('Projects', projectData, Project, query);
    },
    getAllProjects: function() {
      var query = Project.find({});
      return cMthds.gGetAll('Projects', query);
    },
  };
  module.exports = projectFunction;
})();
