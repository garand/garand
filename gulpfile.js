var gulp         = require('gulp');
var sass         = require('gulp-sass');
var notify       = require("gulp-notify");
var browserSync  = require('browser-sync');
var minifyCSS    = require('gulp-minify-css');
var connect      = require('gulp-connect-php');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('connect', function() {
	connect.server({
		hostname: '127.0.0.1',
		port: 8000,
		open: false
	}, function () {
		browserSync({
			proxy: '127.0.0.1:8000',
			port: 8080,
			notify: false,
			ghostMode: false
		});
	});
});

gulp.task('sass', function () {
	gulp.src('./assets/scss/**/*.scss')
		.pipe(sass({
			errLogToConsole: false
		}))
		.on('error', notify.onError())
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(gulp.dest('./assets/style/'))
		.pipe(browserSync.reload({stream:true}))
		.pipe(notify({ message: 'Build Complete' }));
});

gulp.task('reload', function () {
	browserSync.reload();
});

gulp.task('watch', function() {
	gulp.watch('./assets/scss/**/*.scss', ['sass']);
	gulp.watch("./**/*.html", ['reload']);
});

gulp.task('default', ['build', 'connect', 'watch'], function() {});
gulp.task('build', ['sass'], function() {});
