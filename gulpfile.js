'use strict';

// Importações do Gulp
import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel'

/******* JSX *******/
gulp.task('gulpTransformJS', function () {
    console.log("compile gulpTransformJS...");
    return gulp.src("./src/components/*.jsx").
    pipe(babel({
        plugins: ['transform-react-jsx']
    })).
    pipe(gulp.dest("./src/components/js"));
});

gulp.task('gulpContactJS', function () {
    console.log("compile gulpFooterJS...");
    return gulp
        .src([
            './src/components/js/Contact.js'
        ])
        .pipe(concat('Contact.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpFooterJS', function () {
    console.log("compile gulpFooterJS...");
    return gulp
        .src([
            './src/components/js/Footer.js'
        ])
        .pipe(concat('Footer.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpIntroJS', function () {
    console.log("compile gulpIntroJS...");
    return gulp
        .src([
            './src/components/js/Intro.js'
        ])
        .pipe(concat('Intro.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpPortfolioJS', function () {
    console.log("compile gulpPortfolioJS...");
    return gulp
        .src([
            './src/components/js/Portfolio.js'
        ])
        .pipe(concat('Portfolio.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpPortfolioItemJS', function () {
    console.log("compile gulpPortfolioItemJS...");
    return gulp
        .src([
            './src/components/js/PortfolioItem.js'
        ])
        .pipe(concat('PortfolioItem.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpTimelineJS', function () {
    console.log("compile gulpTimelineJS...");
    return gulp
        .src([
            './src/components/js/Timeline.js'
        ])
        .pipe(concat('Timeline.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpTimelineItemJS', function () {
    console.log("compile gulpTimelineItemJS...");
    return gulp
        .src([
            './src/components/js/TimelineItem.js'
        ])
        .pipe(concat('TimelineItem.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('gulpTitleJS', function () {
    console.log("compile gulpTitleJS...");
    return gulp
        .src([
            './src/components/js/Title.js'
        ])
        .pipe(concat('Title.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/components/minify'));
});

gulp.task('buildjs', gulp.series(
    'gulpContactJS',
    'gulpFooterJS',
    'gulpIntroJS',
    'gulpPortfolioJS',
    'gulpPortfolioItemJS',
    'gulpTimelineJS',
    'gulpTimelineItemJS',
    'gulpTitleJS',
));
