'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var expand = require('expands');

/* Constants */

var constant = expand({
  dir: {
    lib: 'lib',
    test: 'test',
    testLib: '{dir.test}/lib',
    unitTest: '{dir.test}/unit',
    testResources: '{dir.test}/resources',
  },
  file: {
    testSetup: '{dir.testLib}/setup.js'
  },
  set: {
    all: [
      '{dir.lib}/**/*.js',
      '{dir.test}/**/*.js',
      'gulpfile.js'
    ],
    code: [ '{dir.lib}/**/*.js' ],
    test: [ '{dir.test}/**/*.js' ],
    testSets: [
      '{dir.test}/**/*.js',
      '!{dir.testLib}/**/*.js',
      '!{dir.testResources}/**/*.js'
    ],
    unitTests: [ '{dir.unitTest}/**/*.js' ],
    testResources: [ '{dir.testResources}/**/*.js' ],
    testTriggers: [
      '{dir.lib}/**/*.js',
      '{dir.testLib}/**/*.js',
      '{dir.testResources}/**/*.js'
    ]
  }
});

var f = constant.file;
var s = constant.set;

/* Gulp helpers */

var watching = false;

gulp.doneCallback = function (err) {
  if (!watching) {
    process.exit(err ? 1 : 0);
  }
};

var onError = function (err) {
  $.util.log(
    $.util.colors.red(
      err && err.stack ? err.stack : err
    )
  );

  if (watching) {
    this.emit('end');
  }
  else {
    process.exit(1);
  }
};

/* Gulp tasks */

gulp.task('lint', function () {
  return lint(
    gulp.src(s.all)
  );
});

gulp.task('unit-test', function () {
  return test(
    gulp.src(s.unitTests)
  );
});

gulp.task('test', function (cb) {
  gulp.src(s.code)
    .pipe($.istanbul({
      includeUntested: true
    }))
    .on('error', $.notify.onError({
      title: 'Test',
      message: '<%= error.message %>'
    }))
    .on('error', onError)
    .on('finish', function () {
      test(gulp.src(s.testSets))
        .pipe($.istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('watch', function () {
  watching = true;

  // Lints changed files
  $.watch(s.all, lint);

  // Tests using only changed test files
  $.watch(s.testSets, test);

  // Executes unit tests on code and test resource changes
  gulp.watch(s.testTriggers, [ 'unit-test' ]);
});

gulp.task('coveralls', [ 'lint', 'test' ], function () {
  return gulp.src('coverage/lcov.info')
    .pipe($.coveralls());
});

gulp.task('default', [ 'watch' ]);

/* Gulp task logic */

function lint(src) {
  return src
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      title: 'Lint',
      message: function (file) {
        if (!file.jshint || file.jshint.success) {
          return false;
        }

        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return $.util.template(
              '(<%= line %>:<%= character %>) <%= reason %>',
              {
                file: file,
                line: data.error.line,
                character: data.error.character,
                reason: data.error.reason
              }
            );
          }
        }).join('\n');

        return '<%= file.relative %> ' +
          '(<%= file.jshint.results.length %> ' +
          'error<% if (file.jshint.results.length > 1) { %>s<% } %>).\n' +
          errors;
      }
    }))
    .pipe($.jshint.reporter('fail'))
    .on('error', onError);
}

function test(src) {
  require('./' + f.testSetup);

  return src
    .pipe($.mocha({ reporter: 'dot' }))
    .on('error', $.notify.onError({
      title: 'Test',
      message: '<%= error.message %>'
    }))
    .on('error', onError);
}
