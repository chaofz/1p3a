const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config.js');

gulp.task('gfonts', () => {
  return gulp.src('node_modules/gfonts/**')
    .pipe(gulp.dest('public/vendor/gfonts'));
});

gulp.task('images', () => {
  return gulp.src('assets/images/**')
    .pipe(gulp.dest('public/images'));
});

gulp.task('static', ['gfonts', 'images']);

gulp.task('sass', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', ['sass'], () => {
  return gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('minify-css', () =>{
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
  webpackConfig.watch = false;
  return gulp.src('src/entry.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('public/js'));
});

gulp.task('js:watch', () => {
  webpackConfig.watch = true;
  return gulp.src('src/entry.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('public/js'));
});

gulp.task('minify-js', ['js'], () => {
  return gulp.src('public/js/bundle.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('dev', ['js:watch', 'sass:watch']);
gulp.task('deploy', ['sass', 'js']);
gulp.task('build', ['static', 'js', 'sass']);
gulp.task('prod', ['build', 'minify-js', 'minify-css']);