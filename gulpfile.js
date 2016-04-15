/*global require*/
"use strict";

var gulp = require('gulp'),
	path = require('path'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
	data = require('gulp-data'),
	jade = require('gulp-jade'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync');

/*
* Change directories here
*/
var settings = {
	publicDir: 'app',
	sassDir: 'sass',
	cssDir: 'app/css',
  jsDir: 'js',
  jsOutDir: 'app/js'
};

/**
 * Compile .jade files and pass in data from json file
 * matching file name. index.jade - index.jade.json
 */
gulp.task('jade', function () {
	return gulp.src('*.jade')
		.pipe(data(function (file) {
			return require('./_data/' + path.basename(file.path) + '.json');
		}))
		.pipe(jade())
		.pipe(gulp.dest(settings.publicDir));
});

/**
 * Recompile .jade files and live reload the browser
 */
gulp.task('jade-rebuild', ['jade'], function () {
	browserSync.reload();
});

/**
 * Wait for jade and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'jade'], function () {
	browserSync({
		server: {
			baseDir: settings.publicDir
		},
		notify: false
	});
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
	return gulp.src(settings.sassDir + '/main.sass')
		.pipe(sass({
			includePaths: [settings.sassDir],
			outputStyle: 'compressed'
		}))
		.on('error', sass.logError)
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest(settings.cssDir))
		.pipe(browserSync.reload({stream: true}));
});

/**
 * Move js files to public js directory with uglify and jshint
 */
gulp.task('js', function () {
  return gulp.src(settings.jsDir + '/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(settings.jsOutDir))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch .jade files run jade-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch(settings.sassDir + '/**', ['sass']);
  gulp.watch(settings.jsDir + '/**', ['js']);
	gulp.watch(['*.jade', '**/*.jade'], ['jade-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
