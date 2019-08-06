var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var awspublish = require('gulp-awspublish');
var rename = require("gulp-rename");
var merge2 = require("merge2");
var cloudfront = require("gulp-cloudfront-invalidate-aws-publish");
var AWS = require("aws-sdk");

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("src/scss/*.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Copy files into dist folder & auto-inject into browsers
gulp.task('copy', function () {
    return gulp.src(["src/*.html", "src/*.pdf", "src/*.png", "src/*.xml", "src/*.ico", "src/*.svg",
        "src/site.webmanifest", "src/.htaccess"])
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
});

// Copy js files into dist folder & auto-inject into browsers
gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/popper.js/dist/popper.min.js',
        'node_modules/jquery/dist/jquery.min.js', "src/js/*.js"])
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

// Copy assets files into dist folder & auto-inject into browsers
gulp.task('assets', function () {
    return gulp.src("src/assets/**/*")
        .pipe(gulp.dest("dist/assets"))
        .pipe(browserSync.stream());
});

gulp.task('clean', function () {
    return del('dist/**', {force: true});
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(
    gulp.parallel('sass', 'js', 'copy', 'assets'), function () {

        browserSync.init({
            server: {
                baseDir: "dist",
                serveStaticOptions: {
                    extensions: ["html"]
                }
            }
        });

        gulp.watch("src/scss/*.scss", gulp.series('sass'));
        gulp.watch("src/js/*.js", gulp.series('js'));
        gulp.watch("src/*.html", gulp.series('copy'));
        gulp.watch("src/assets/*", gulp.series('assets'));
    }));

gulp.task('aws-deploy', function () {
    var aws = {
        distribution: "E1WVACBK45GZ13",
        credentials: new AWS.SharedIniFileCredentials(),
        params: {
            Bucket: "yuliacech.com"
        },
        region: "eu-central-1",
        wait: true
    };
    var publisher = awspublish.create(aws);

    var normalHeaders = {
        "Cache-Control": "max-age=315360000, no-transform, public",
    };
    var htmlHeaders = {
        ...normalHeaders,
        'Content-Type': 'text/html; charset=utf-8'
    };
    var StreamAllExclHtml = gulp.src(["dist/**/*", "!dist/**/*.html"])
        .pipe(publisher.publish(normalHeaders));

    var StreamHtml = gulp.src(["dist/**/*.html"])
        .pipe(rename(function (path) {
                path.extname = "";
            }
        ))
        .pipe(publisher.publish(htmlHeaders));
    return merge2(StreamAllExclHtml, StreamHtml)
        .pipe(publisher.sync())
        .pipe(cloudfront(aws))
        .pipe(awspublish.reporter());

});

// Static Server + watching scss/html files
gulp.task('build', gulp.series('clean',
    gulp.parallel('sass', 'js', 'copy', 'assets')));


gulp.task('default', gulp.series('serve'));
