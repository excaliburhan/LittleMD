/**
 *
 * @author xiaoping (edwardhjp@gmail.com)
 * @type js
 * @gulp
 */

const gulp = require('gulp')
const gulpLess = require('gulp-less')
const cleanCss = require('gulp-clean-css')
const concat = require('gulp-concat')

const paths = {
  js: './js/*.js',
  style: './style/*.less',
  images: './images/**',
}

gulp.task('style', () => {
  gulp
    .src(paths.style)
    .pipe(gulpLess())
    .pipe(concat('bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./css'))
})

gulp.task('reload', () => {
  gulp.watch(paths.style, ['style'])
})

gulp.task('default', ['reload'])
