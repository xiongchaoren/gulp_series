const gulp = require('gulp');
const browsersync =  require('browser-sync');
const bs = browsersync.create();
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const fs = require('fs');
const path = require('path');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const base_dir = './src';       // web服务器根目录

// 循环获取链接
function getLink (listen_floder) {
    let add_files = []
    function getFiles (u_path) {
        var a_path = path.resolve(__dirname, path.join(base_dir, u_path));
        var files = fs.readdirSync(a_path)
        files.forEach(item => {
            var stat = fs.statSync(path.join(a_path, item))
            var c_path = path.join(u_path, item)
            if (stat.isDirectory()) {
                getFiles(c_path)
            }
            if (stat.isFile()) {
                add_files.push(c_path)
            }
        })
    }
    getFiles(listen_floder)
    return add_files;
}

// 任务
function compile () {
    gulp.src(path.resolve(__dirname, './ejs/**/*.ejs'))
        .pipe(ejs({
            files: getLink('tpl')
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(path.resolve(__dirname, base_dir)))
}

// 编译ejs为html
gulp.task('ejs-compile', function() {
    return compile()
})

// 开启模板文件监听，自动刷新页面
gulp.task('server', function() {
    bs.init({
        server: {
            baseDir: base_dir,
        },
        startPath: '/index.html'
    });

    gulp.watch([path.resolve(__dirname, './ejs/**/*.ejs')], ['ejs-compile'])

    // gulp-watch包提供
    return watch([path.resolve(__dirname, './src/**')],function (file) {
        if (['unlink', 'add'].indexOf(file.event) > -1) {
            compile ();
        } else {
            bs.reload();
        }
    })
});

gulp.task('default', ['ejs-compile', 'server']);