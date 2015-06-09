"use strict";

var gulp = require("gulp");
var browserSync = require('browser-sync').create();
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");
var buffer = require("vinyl-buffer");
var opn = require("opn");
var sass = require("gulp-sass");
var connect = require("gulp-connect");
var del = require("del");
var minifyCss = require("gulp-minify-css");
var exec = require("child_process").exec;

gulp.task("javascript", function (cb) {
	browserify({
		entries: "./src/components/HelloWorld.js",
		extensions: [".js"],
		debug: true
	})
		.transform(babelify)
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("./build/js"))
		.on("end", function() {
			cb();
		});
});

gulp.task("javascript:production", function () {
	browserify({
		entries: "./src/components/HelloWorld.js",
		extensions: [".js"],
		debug: true
	})
		.transform(babelify)
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest("./dist/js"));
});

gulp.task("sass", function (cb) {
	gulp.src("./src/styles/*.scss")
		.pipe(sass())
		.pipe(gulp.dest("./build/css"))
		// .pipe(connect.reload())
		.on("end", function() {
			cb();
		});
});

gulp.task("javascript:watch", function() {
	gulp.watch("src/components/**/*.js").on("change", function() {
		runSequence(["javascript"]);
	});
});

gulp.task("sass:watch", function() {
	gulp.watch("src/**/*.scss").on("change", function() {
		runSequence(["sass"]);
	});
});

gulp.task("copy:watch", function() {
	gulp.watch(["src/**/*.html", "src/**/*.png", "src/**/*.css"]).on("change", function() {
		runSequence(["copy"]);
		});
});

gulp.task("sass:dist", function () {
	gulp.src("src/styles/*.scss")
		.pipe(sass())
		.pipe(buffer())
		.pipe(minifyCss({compatibility: "ie8"}))
		.pipe(gulp.dest("dist/css"));
});

gulp.task("copy", function (cb) {
	gulp.src("./src/index.html")
		.pipe(gulp.dest("./build"));

	gulp.src("./src/styles/**/*.css")
		.pipe(gulp.dest("./build/css"));

	gulp.src("./src/assets/**/*")
		.pipe(gulp.dest("./build/assets"))
		.on("end", function() {
        cb();
    });
});

gulp.task("copy:production", function () {
	gulp.src("src/index.html")
		.pipe(gulp.dest("./dist"));

	gulp.src("src/styles/*.css")
		.pipe(gulp.dest("./dist/css"));

	gulp.src("src/assets/**/*")
		.pipe(gulp.dest("./dist/assets"));
});

gulp.task("clean", function (cb) {
	return del("./build", cb);
});

gulp.task("clean:production", function (cb) {
	return del(["./dist"], cb);
});

gulp.task("watch", ["javascript:watch", "sass:watch", "copy:watch"]);

gulp.task("opn", function () {
	opn("http://localhost:3000");
});

gulp.task("server", function () {
  connect.server({
    root: "./build",
    port: 3000
    // livereload: {
        // port: 35730
    // }
	});
});

gulp.task("test", function(cb) {
    exec("karma start --single-run", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    });
});

gulp.task("lint", function(cb) {
    exec("eslint src/components", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:3000",
        files: [
        	"./build/**/*.html",
        	"./build/**/*.js",
        	"./build/**/*.css"
        ]
    });
});

gulp.task("default", function () {
	runSequence(["clean"], ["javascript", "sass", "copy"], "server", "opn", "watch", "browser-sync");
});

gulp.task("build", ["default"]);

gulp.task("production", function () {
	runSequence(["clean:production"], ["javascript:production"], "sass:dist", "copy:production");
});
