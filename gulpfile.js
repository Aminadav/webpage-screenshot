var gulp = require('gulp');
var rename = require("gulp-rename");

gulp.task('switch-ws', function(arg) {
  gulp.src('src/manifest_ws.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('src/'));
});

gulp.task('switch-sb', function(arg) {
  gulp.src('src/manifest_sb.json')
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('src/'));
});