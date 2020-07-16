gulp = require 'gulp'
sass = require 'gulp-sass'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
connect = require 'gulp-connect'
sourcemaps = require 'gulp-sourcemaps'
minify = require 'gulp-minify'
del = require 'del'

CLEAN = 'clean'
VIEWS = 'views'
STYLES = 'styles'
ASSETS = 'assets'
SCRIPTS = 'scripts'
SCRIPTS_VENDOR = 'scripts-vendor'
SCRIPTS_APP = 'scripts-app'
BUILD = 'build'
WATCH = 'watch'
CONNECT = 'connect'
DEFAULT = 'default'


src = gulp.src
dest = gulp.dest
watch = gulp.watch
series = gulp.series
parallel = gulp.parallel


gulp.task CLEAN, ->
  del(['dist'])

gulp.task VIEWS, ->
  src(['./src/views/index.html'])
    .pipe(dest('./dist/'))
    .pipe(connect.reload())

gulp.task STYLES, ->
  src(['./src/styles/styles.sass'])
    .pipe(sass())
    .pipe(dest('./dist/assets/styles/'))
    .pipe(connect.reload())

gulp.task ASSETS, ->
  src(['./src/assets/**/*.*'])
    .pipe(dest('./dist/assets/'))
    .pipe(connect.reload())

gulp.task SCRIPTS_VENDOR, ->
  src(['./src/scripts/vendor/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/assets/scripts/'))
    .pipe(connect.reload())

gulp.task SCRIPTS_APP, ->
  src(['./src/scripts/app/**/*.coffee'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.coffee'))
    .pipe(coffee())
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/assets/scripts/'))
    .pipe(connect.reload())

gulp.task SCRIPTS,
  parallel(SCRIPTS_VENDOR, SCRIPTS_APP)

gulp.task BUILD,
  series(CLEAN, parallel(VIEWS, STYLES, ASSETS, SCRIPTS))

gulp.task CONNECT, ->
  connect.server({
    root: 'dist',
    livereload: true
  })

gulp.task WATCH, ->
  watch(['./src/views/index.html'], series(VIEWS))
  watch(['./src/styles/**/*.*'], series(STYLES))
  watch(['./src/assets/**/*.*'], series(ASSETS))
  watch(['./src/scripts/vendor/**/*.js'], series(SCRIPTS_VENDOR))
  watch(['./src/scripts/app/**/*.coffee'], series(SCRIPTS_APP))

gulp.task DEFAULT,
  series(BUILD, parallel(CONNECT, WATCH))
