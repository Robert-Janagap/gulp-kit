var gulp       = require('gulp');

/*gulp packages*/
var autoprefix = require('gulp-autoprefixer'),
concat         = require('gulp-concat'),
changed        = require('gulp-changed'),
connect        = require('gulp-connect'),
jade           = require('gulp-jade'),
jshint         = require('gulp-jshint'),
imagemin       = require('gulp-imagemin'),
htmlmin			= require('gulp-minify-html'),
plumber        = require('gulp-plumber'),
pngquant       = require('imagemin-pngquant'),
rename         = require('gulp-rename'),
sass           = require('gulp-sass'),
stylish        = require('jshint-stylish'),
sourcemaps     = require('gulp-sourcemaps'),
uncss          = require('gulp-uncss'),
watch          = require('gulp-watch'),
uglify         = require('gulp-uglify');

//gulp task

gulp.task('server', function(){
	connect.server({
		livereload: true,
		port: 3000
	})
});

gulp.task('jade', function(){
	var src  = 'src/views/index.jade';
	var dist = 'build/';
	return gulp.src(src)
			.pipe(changed(dist))
			.pipe(plumber())
			.pipe(jade({
				pretty: false
				}))
			.pipe(gulp.dest(dist));
});

gulp.task('scss', function(){
	var src  = "src/scss/main.scss";
	var dist = "build/assets/css/";
	return gulp.src(src)
			.pipe(changed(dist))
			.pipe(plumber())
			.pipe(sass())
			.pipe(gulp.dest(dist));
});

gulp.task('jshint', function(){
	var src  = ["src/js/*.js", "src/js/scripts/*.js"];
	var dist = "build/assets/js/"
	return gulp.src(src)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('main.js'))
		.pipe(gulp.dest(dist));
});

//minification
gulp.task('minify-html', function(){
	var src  ="build/*.html";
	var dist = "app/";
	return gulp.src(src)
			.pipe(changed(dist))
			.pipe(htmlmin())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(dist));
	});
gulp.task('minify-css', function(){
	var src  = "build/assets/css/*.css";
	var dist = "app/assets/css/";
	return gulp.src(src)
			.pipe(changed(dist))
			.pipe(sourcemaps.init())
				.pipe(sass({outputStyle: 'compressed'}))
				.pipe(uncss({
					html: ['build/*.html']
				}))
				.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write({addComment: false}))
			.pipe(gulp.dest(dist));
});

gulp.task('minify-js', function(){
	var src  = "build/assets/js/*.js";
	var dist = "app/assets/js/";
	return gulp.src(src)
			.pipe(changed(dist))
			.pipe(sourcemaps.init())
				.pipe(concat('main.min.js'))
				.pipe(uglify())
			.pipe(sourcemaps.write({addComment: false}))
			.pipe(gulp.dest(dist));
});

gulp.task('minify-image', function(){
	var src  = "src/images/**/*";
	var dist = "app/assets/images/";
	return gulp.src(src)
			.pipe(imagemin({
				optimizationLevel: 7,
				progressive: true,
				multipass: true,
				use: [pngquant()]
			}))
			.pipe(gulp.dest(dist));
});

//development
gulp.task('watching', function(){
	gulp.watch('src/views/**/*.jade', ['jade']);
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch(['src/js/*.js','src/js/scripts/*.js'], ['jshint']);
});

gulp.task('livereload', function(){
	watch(['build/index.html', 'build/assets/css/main.css', 'build/assets/js/main.js'])
		.pipe(connect.reload());
});

gulp.task('default', ['server', 'watching', 'livereload']);

//production
gulp.task('production', ['minify-html', 'minify-css', 'minify-js', 'minify-image']);


