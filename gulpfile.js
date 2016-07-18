var gulp = require('gulp');
var clean = require('gulp-clean');
var htmlReplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');

var exec = require('child_process').exec;

gulp.task('clean', function (callback) {
  return gulp.src(['build', 'dev'])
    .pipe(clean())
    .on('endClean', callback);
});

gulp.task("ts", function (callback) {
  exec('./node_modules/.bin/tsc', function (err, sout, serr) {
    console.log(sout);
    if (err) {
      return callback(err);
    }
    callback();
  });
});

gulp.task('sass', function() {
  gulp.src('web/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dev/css/'));
});

gulp.task('minify', ['ts'], function (callback) {
  return gulp.src('web/index.html')
    .pipe(htmlReplace({
      'js': 'app.min.js',
      'vendor-js': 'materialize.js',
      'css': 'css/materialize.css'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .on('endMinify', callback);
});

gulp.task('default', ['minify', 'sass'], function () {
  exec('./node_modules/.bin/jspm bundle-sfx dev/main build/app.min.js --minify', function (err, sout, serr) {
    console.log(sout);
  });
});

gulp.task('dev', ['sass'], function (callback) {
  exec('./node_modules/.bin/tsc', function (err, sout, serr) {
    console.log(sout);
    if (err) {
      return callback(err);
    }
    return gulp.src(['web/**/*.*', 'config.js', '!web/**/*.ts', '!web/**/*.scss'])
      .pipe(gulp.dest("dev"));
  });
});
