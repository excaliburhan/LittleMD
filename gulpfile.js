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

gulp.task('minifyCss', () => {
  gulp
    .src('./style/*.less')
    .pipe(gulpLess())
    .pipe(concat('bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./css'))
})

gulp.task('default', ['minifyCss'])
