var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var opn = require('opn');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var del = require('del');
var minifyCss = require('gulp-minify-css');

gulp.task('compile', function () {
    browserify({
        entries: './src/components/Main.js',
        extensions: ['.js'],
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(connect.reload());
});

gulp.task('compile:production', function () {
    browserify({
        entries: './src/components/Main.js',
        extensions: ['.js'],
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {
    gulp.src('./src/styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('sass:dist', function () {
    gulp.src('src/styles/*.scss')
        .pipe(sass())
        .pipe(buffer())
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function () {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());

    gulp.src('./src/styles/*.css')
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());

    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('build/assets'))
});

gulp.task('copy:production', function () {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));

    gulp.src('src/styles/*.css')
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('clean', function () {
    return del('build');
});

gulp.task('clean:production', function () {
    return del(['dist']);
});

gulp.task("watch", function () {
    gulp.watch(['src/**/*.js', 'src/*.html', 'src/styles/*.scss'], function () {
        runSequence(['compile', 'copy', 'sass']);
    });
});

gulp.task('reload', function () {
    connect.reload();
});

gulp.task('opn', function () {
    opn('http://localhost:8080');
});

gulp.task('server', function () {
    connect.server({
        root: './build',
        livereload: true
    });
});

gulp.task('default', function () {
    runSequence('clean', ['compile', 'copy', 'sass'], 'server', 'opn', 'watch');
});

gulp.task('build',['default']);

gulp.task('production', function () {
    runSequence('clean:production', ['compile:production', 'copy:production', 'sass:dist']);
});