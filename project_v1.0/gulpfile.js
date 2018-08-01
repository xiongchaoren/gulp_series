var gulp = require('gulp');
var browsersync =  require('browser-sync');
var less =  require('gulp-less');
var cssmin =  require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var bs = browsersync.create();

gulp.task('server', ['compile-css'], function() {
    bs.init({
        server: {
            baseDir: './src/'
        }
    });

    gulp.watch('./src/less/**/*.less', ['compile-css']);
    gulp.watch('./src/js/**/*.js', ['compile-js']);
    gulp.watch(['./src/**/*.html']).on('change',function(){
        bs.reload();
    });
});

gulp.task('compile-css', () => {
    return gulp.src(['./src/less/**/*.less', '!./src/less/**/_*.less'])
        .pipe(less())
        .pipe(rename(path => {
            path.extname = '.css'
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(bs.reload({stream: true}));
});

gulp.task('compile-js', () => {
    return gulp.src(['./src/js/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./src/scripts'))
        .pipe(bs.reload({stream: true}))
});

gulp.task('default', ['compile-css','compile-js','server']);