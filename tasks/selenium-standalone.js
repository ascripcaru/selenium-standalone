'use strict';

var grunt = require('grunt')
  , jarName = 'selenium-server-standalone-2.48.2.jar'
  , seleniumOptions = ['-jar']
  , serverProcess = null
  , spawn = require('child_process').spawn
  , started = false;

/**
 * Starts the server
 * @param cb
 */
function start(cb) {
  seleniumOptions.push(__dirname + '/../jar/' + jarName);

  if (!started) {
    serverProcess = spawn('java', seleniumOptions);
    serverProcess.on('uncaughtException', function(err) {
      if (err.errno = 'EADDRINUSE') {
        grunt.log.error('PORT already in use');
      } else {
        grunt.log.error(err);
        process.exit(1);
      }
    });
    serverProcess.stderr.setEncoding('utf8');
    serverProcess.stderr.on('data', function(data) {
      console.log(data);
    });
    started = true;
    grunt.log.ok('Selenium standalone started');
    cb();
  } else {
    cb(grunt.log.writeln('Selenium already started'));
  }
}

/**
 * Stops the selenium server
 * @param cb
 */
function stop(cb) {
  if (serverProcess) {
    serverProcess.on('close', function() {
      cb();
    });
    serverProcess.kill('SIGTERM');
    started = false;
  }
}

process.on('exit', function() {
  if (started) {
    stop();
  }
});

module.exports = function(grunt) {
  grunt.registerTask('selenium-start', 'Starts the selenium standalone jar', function() {
    var done = this.async();
    return start(done);
  });

  grunt.registerTask('selenium-stop', 'Stops the selenium standalone jar', function() {
    var done = this.async();
    return stop(done);
  });
};
