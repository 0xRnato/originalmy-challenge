const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', ['watch', 'replace', 'minify-main', 'minify-controllers', 'minify-services', 'minify-css']);

gulp.task('prod', ['replace', 'minify-main', 'minify-controllers', 'minify-services', 'minify-css']);

gulp.task('watch', function () {
	gulp.watch('client/js/*.js', ['replace', 'minify-main']);
	gulp.watch('client/js/controllers/*.js', ['replace', 'minify-controllers']);
	gulp.watch('client/js/services/*.js', ['replace', 'minify-services']);
	gulp.watch('client/css/*.css', ['replace', 'minify-css']);
});

gulp.task('minify-css', function () {
	return gulp.src(['client/css/*.css'])
		.pipe(concat('main.css'))
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('client/dist'));
});

gulp.task('minify-main', function () {
	return gulp
		.src([
			'!client/js/*.spec.js',
			'client/js/*.js'])
		.pipe(concat('main.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(minify())
		.pipe(gulp.dest('client/dist'));
});

gulp.task('minify-controllers', function () {
	return gulp
		.src([
			'!client/js/controllers/*.spec.js',
			'client/js/controllers/*.js'])
		.pipe(concat('controllers.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(minify())
		.pipe(gulp.dest('client/dist'));
});

gulp.task('minify-services', function () {
	return gulp
		.src([
			'!client/js/services/*.spec.js',
			'client/js/services/*.js'])
		.pipe(concat('services.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(minify())
		.pipe(gulp.dest('client/dist'));
});

gulp.task('replace', function () {
	return gulp
		.src(['client/index.html'])
		.pipe(replace(/\w=[0-9]{13,13}/g, "v=" + Date.now()))
		.pipe(gulp.dest('client/'));
});
