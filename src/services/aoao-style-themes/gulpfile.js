const [gulp, less] = [
    require('gulp'),
    require('gulp-less'),
];
gulp.task('style', function() {
    gulp.src('./src/style.less')
        .pipe(less())
        .pipe(gulp.dest('./lib'));
    console.log(' build style success')
})
gulp.task('theme_admin', function() {
    gulp.src('./src/theme_admin.less')
        .pipe(less())
        .pipe(gulp.dest('./lib'));
    console.log('build theme_admin success');
})
gulp.task('theme_site', function() {
    gulp.src('./src/theme_site.less')
        .pipe(less())
        .pipe(gulp.dest('./lib'));
    console.log('build theme_admin success');
})

gulp.task('default', ['style', 'theme_admin', 'theme_site']);
