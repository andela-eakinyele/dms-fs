(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var projectSchema = new Schema({
    _id: {
      type: Number,
      min: 113,
      required: true,
      default: 113,
      unique: true
    },
    title: {
      type: String,
      unique: true,
      required: (true, ' title is invalid')
    },
    users: [{
      type: Number,
      ref: 'Users'
    }],
    docs: [{
      type: Number,
      ref: 'Documents'
    }],
    roles: {
      type: [String],
      required: (true, 'Provide project roles')
    }
  });

  projectSchema.statics.getMaxId = function() {
    var query = this.find({}, '_id');
    return new Promise(function(resolve, reject) {
      query.exec(function(err, ids) {
        if (err) {
          reject(Error(err));
        }
        resolve(ids);
      });
    });
  };

  module.exports = mongoose.model('Projects', projectSchema);
})();
