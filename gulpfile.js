var gulp        = require('gulp');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');

gulp.task('jekyll-build', function (done) {
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('sass', function () {
    return gulp.src('_sass/main.scss')
        .pipe(sass({
            includePaths: ['_sass']
        }))
        .on('error', console.error.bind(console))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch([
      '!_site/**',
      'scripts/*.js',
      'scripts/**/*.js',
      '*.html',
      '**/*.html',
       '**/*.md'], ['jekyll-build']);
});

gulp.task('default', ['sass', 'jekyll-build']);
