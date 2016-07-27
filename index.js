var async = require('async');
var fs = require('fs');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;
var through = require('through2');

module.exports = function (repository, branch, tmpFolder) {

  var tmpRepoFolder;
  var remoteBranch = branch || null;
  var remoteRepository = repository || '';

  if (tmpFolder) {
    tmpRepoFolder = tmpFolder.replace('/', path.sep);
  } else {
    tmpRepoFolder = 'tmp-repo';
  }

  function removeTmpRepoFolder(cb) {
    if (fs.lstatSync(tmpRepoFolder).isDirectory()) {
      rimraf(tmpRepoFolder, cb);
    }
  }

  function createTmpRepoFolder(cb) {
    if (!fs.lstatSync(tmpRepoFolder).isDirectory()) {
      mkdirp(tmpRepoFolder, cb);
    }
  }

  function cmdLog(cmd, cmdText) {
    cmd.on('data', function (data) {
      gutil.log(data.toString());
    });
    cmd.stderr.on('data', function (data) {
      gutil.log(cmdText + ': ' + data.toString());
    });
    cmd.stdout.on('data', function (data) {
      gutil.log(cmdText + ': ' + data.toString());
    });
  }

  function cloneRemoteRepository(cb) {
    gutil.log('Cloning remote repository');
    var cmd = spawn('git', ['clone', remoteRepository]);
    cmd.on('close', function (code) {
      if (code) {
        return cb('git clone error with code: ' + code);
      }
      return cb(null);
    });
    cmdLog(cmd, 'git clone');
  }

  function createLocalBranch(cb) {
    gutil.log('Creating remote branch');
    var cmd = spawn('git', ['branch', remoteBranch]);
    cmd.on('close', function (code) {
      if (code) {
        return cb('git clone error with code: ' + code);
      }
      return cb(null);
    });
    cmdLog(cmd, 'git branch');
  }

  function gitPush(cb) {
    gutil.log('Pushing to remote repository');
    var cmd = spawn('git', ['push', 'origin', options.remoteBranch], {cwd: tmpRepoFolder});
    cmd.on('close', function (code) {
      if (code !== 0) {
        return cb('git push exited with code ' + code);
      }
      return cb(null);
    });
    cmdLog(cmd, 'git push');
  }

  return through.obj(function (file, enc, cb) {
    callback(null, file);
  }, function (done) {
    async.waterfall([
      removeTmpRepoFolder,
      createTmpRepoFolder,
      cloneRemoteRepository,
      createLocalBranch,
      gitPush
    ], function (err) {
      removeTmpRepoFolder(function(err) {
        if(err) {
          done(err);
        } else {
          done(null);
        }
      });
    });
  });
};
