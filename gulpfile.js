var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');

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

// Static Server + watching scss/html files
gulp.task('build', gulp.series('clean',
    gulp.parallel('sass', 'js', 'copy', 'assets')));


gulp.task('default', gulp.series('serve'));
