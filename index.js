var through = require('through2');
var createGitBranch = require('create-git-branch');

module.exports = function (repository, branch, tmpFolder) {

  return through.obj(function (file, enc, cb) {
    cb(null, file);
  }, function (done) {
    createGitBranch(repository, branch, tmpFolder).then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });

};
