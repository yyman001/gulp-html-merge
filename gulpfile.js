var gulp = require('gulp');

var htmlMerge = require('gulp-html-merge');

gulp.task('demo',function(){
   return gulp.src(['test/demo.html','test/tag.html'])
   .pipe(htmlMerge())
   .pipe(gulp.dest('test/out/'));
});
