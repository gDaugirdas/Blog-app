const gulp = require('gulp'),
	exec = require('child_process').exec;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const sassSRC = 'src/sass/app.scss';
const cssDIST = './public/styles';
const jsSRC = 'script.js';
const jsFolder = 'src/js/';
const jsDIST = './public/js';
const styleWatch = 'src/sass/**/*.scss';
const jsWatch = 'src/js/**/*.js';
const jsFiles = [jsSRC];

gulp.task('nodestart', function (cb) {
	exec('node app.js', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('style', function (done) {
	gulp.src(sassSRC)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				errLogToConsole: true,
				outputStyle: 'compressed',
			})
		)
		.on('error', console.error.bind(console))
		.pipe(autoprefixer())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(cssDIST));
	done();
});

gulp.task('js', function (done) {
	jsFiles.map(function (entry) {
		return browserify({
			entries: [jsFolder + entry],
		})
			.transform(babelify, { presets: ['@babel/env'] })
			.bundle()
			.pipe(source(entry))
			.pipe(rename({ extname: '.min.js' }))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(uglify())
			.pipe(sourcemaps.write('/'))
			.pipe(gulp.dest(jsDIST));
	});
	done();
});

gulp.task('watch', function (done) {
	gulp.watch(styleWatch, gulp.series('style'));
	gulp.watch(jsWatch, gulp.series('js'));
	done();
});

gulp.task('default', gulp.parallel('nodestart', 'watch'));
