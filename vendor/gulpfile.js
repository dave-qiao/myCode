const [gulp, concat, replace, clean, rename, _package] = [
  require('gulp'),
  require('gulp-concat'),
  require('gulp-replace'),
  require('gulp-clean'),
  require('gulp-rename'),
  require('./package.json'),
];

const _dist = './dist/';

gulp.task('copy_img', () => {
  //拷图片
  gulp.src('./images/*')
  .pipe(gulp.dest('./dist/images'));
});

gulp.task('version_chunk', () => {
  //add_version_then_concat_chunk
  //改版html本号
  gulp.src([`${_dist}index.html`])
  .pipe(replace('.js?version', `.${_package.version}.js`))
  .pipe(replace('.css?version', `.${_package.version}.css`))
  .pipe(gulp.dest('./dist/'));

  //改版文件
  gulp.src([`${_dist}common.js`, `${_dist}config.js`, `${_dist}index.css`, `${_dist}index.js`, `${_dist}vendor.js`])
  .pipe(rename({
    dirname: '',
    suffix: `.${_package.version}`,
  }))
  .pipe(gulp.dest('./dist/'));

  //合并chunk文件
  gulp.src(`${_dist}*.aoao-chunk.js`)
  .pipe(concat(`chunk-bundle.${_package.version}.js`))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('clean-scripts', () => {
  //清除chunk文件
  gulp.src([`${_dist}common.js`, `${_dist}config.js`, `${_dist}index.css`, `${_dist}index.js`, `${_dist}vendor.js`, `${_dist}*.aoao-chunk.js`], { read: false })
  .pipe(clean());
});
