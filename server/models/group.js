(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var groupSchema = new Schema({
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
    description: {
      type: String,
      required: (true, ' Description is invalid')
    },
    passphrase: {
      type: String,
      required: (true, ' Enter a passphrase')
    },
    users: [{
      type: Number,
      ref: 'Users'
    }],
    docs: [{
      type: Number,
      ref: 'Documents'
    }]
  });

  groupSchema.statics.getMaxId = function() {
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

  module.exports = mongoose.model('Groups', groupSchema);
})();
