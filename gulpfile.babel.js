import gulp from 'gulp';
import watch from 'gulp-watch';
import connect from 'gulp-connect';
import browserify from 'browserify';
import {create as bsCreate} from 'browser-sync';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sass from 'gulp-sass';
import sass_global from 'gulp-sass-glob';
import sass_autoprefixer from 'gulp-autoprefixer';
import prettify from 'gulp-prettify';
import pug from 'pug';
import gulpPug from 'gulp-pug';
import changed from 'gulp-changed';
import gulpif from 'gulp-if';
import cached from 'gulp-cached';
import chalk from 'chalk';

const browserSync = bsCreate()
const AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// - task: js
gulp.task('compile-js', () => {
	console.log('run js ...')
    return browserify('dev/build/script/app.js')
        .transform('babelify', {presets: ['env']})
        .bundle()
        .on('end', () => {
			console.log(chalk.green('Files js compiled!'));
		})
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/build/script'))
        .pipe(browserSync.stream())
});

// - task: sass
gulp.task('compile-style', () => {
	console.log('run style ...')
	return gulp.src('dev/build/style/sass/style.scss')
		.pipe(sass_global())
		.pipe(sass())
		.on('error', function(e) {
			console.log(chalk.red(sass.logError));
			this.emit('end')
		})
		.on('end', () => {
			console.log(chalk.green('Files scss compiled!'));
		})
		.pipe(sass_autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(gulp.dest('dist/build/style'))
		.pipe(browserSync.stream());
});

// - task: pug
gulp.task('compile-pug', () => {
	console.log('run pug ...');
	return gulp.src('dev/pug/output/**/*.pug')
		.pipe(changed('dist/output/**/*', {extension: '.html'}))
		.pipe(gulpif(global.isWatching, cached('compile-pug')))
		.pipe(
				gulpPug({
					pug: pug,
					pretty: true
				})
				.on('error', (e) => {
					console.log(chalk.red(e));
					this.emit('end');
				})
				.on('end', () => {
					console.log(chalk.green('Files pug compiled!'));
					setTimeout(function(){
						browserSync.reload();
					}, 100);
				})
			)
			.pipe(gulp.dest('dist/output/'))
			.pipe(browserSync.stream());
})

// - Copy 
gulp.task('copyStatic', () => {
	return gulp.src(["dev/assets/**/*.*", "!dev/assets/svg/*.*"])
		.pipe(gulp.dest("dist/assets"))
	.pipe(connect.reload())
})

// - connect
gulp.task('connect', () => {
	connect.server({
		root: 'dist/output',
		livereload: true
	});
});

// - server
gulp.task('bs', () => {
	browserSync.init({
		proxy: 'localhost/' + __dirname.split('/').reverse()[0] + '/dist/output',
		port: 8080,
		open: true,
		notify: false
	});
});

gulp.task('serve', gulp.series(['compile-js', 'compile-style', 'compile-pug']), () => {
	browserSync.init({
		proxy: 'localhost/' + __dirname.split('/').reverse()[0] + '/dist/output',
		port: 8080,
		open: true,
		notify: true
	});

	gulp.watch('dev/build/script/**/*.js', gulp.series(['compile-js', browserSync.reload]))
	gulp.watch('dev/build/style/sass/style.scss', gulp.series(['compile-style', browserSync.reload]))
    gulp.watch('dev/build/style/sass/*/*.scss', gulp.series(['compile-style', browserSync.reload]))
    gulp.watch('dev/output/*.pug', gulp.series(['compile-pug', browserSync.reload]))
    gulp.watch("dist/**/*.*").on('change', browserSync.reload);
})

gulp.task('watch', gulp.series(['compile-js', 'compile-style', 'compile-pug']), function() {
    gulp.watch('dev/build/script/**/*.js', gulp.series(['compile-js', browserSync.reload]))
	gulp.watch('dev/build/style/sass/style.scss', gulp.series(['compile-style', browserSync.reload]))
    gulp.watch('dev/build/style/sass/*/*.scss', gulp.series(['compile-style', browserSync.reload]))
    gulp.watch('dev/output/*.pug', gulp.series(['compile-pug', browserSync.reload]))
    gulp.watch("dist/**/*.*").on('change', browserSync.reload);
});

gulp.task('build', gulp.series(['compile-js', 'compile-style', 'compile-pug', 'copyStatic', 'bs']), () => {});

// - task: default
gulp.task('default', gulp.series(['build']));