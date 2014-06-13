var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('connect');
var http = require('http');
var browserify = require('browserify');
var shim = require('browserify-shim');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

var port = gutil.env.port || 8000;

gulp.task('dev', ['clean', 'static-files', 'build', 'watch'], function(done) {
  var app = connect();
  app.use(connect.static('build'));

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

gulp.task('clean', function() {
  return gulp.src('build/**/*', {read: false})
    .pipe(clean());
});

gulp.task('static-files', ['clean'], function() {
  return gulp.src('static/**/*')
    .pipe(gulp.dest('build'));
});

var staticFile = function(evnt) {
  gutil.log('copying ' + evnt.path);
  return gulp.src(evnt.path)
    .pipe(gulp.dest('build'));
};

gulp.task('watch', ['build'], function() {
  gulp.watch('js/**/*.js', ['build-dev']);
  gulp.watch('static/**/*', staticFile);
});

var build = function() {
  return browserify({entries: ['./js/main.js'], baseDir: '.'})
    .transform(shim)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('build'));
};

gulp.task('build', ['clean'], build);
gulp.task('build-dev', build);

gulp.task('default', ['dev']);
