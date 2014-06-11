var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('connect');
var http = require('http');

var port = gutil.env.port || 8000;

gulp.task('dev', function(done) {
  var app = connect();
  app.use(connect.static('.'));

  var server = http.createServer(app);
  server.listen(port);

  server.on('listening', function() {
    gutil.log('http server listening on port ' + port);
    done();
  });

  server.on('error', function(err) {
    done(err);
  });
});

gulp.task('default', ['dev']);
