import * as gulp from 'gulp';
import tslint from 'gulp-tslint';
import * as project from '../aurelia.json';

export default gulp.series(
  runCopyToPhoneGap,
  runCopyToPhoneGapWww
);

function runCopyToPhoneGap() {
  return gulp.src(`${project.build.targets[0].output}/*.*`)
    .pipe(gulp.dest('phonegap/scripts'));
}

function runCopyToPhoneGapWww() {
  return gulp.src(`${project.build.targets[0].output}/*.*`)
    .pipe(gulp.dest('phonegap/www/scripts'));
}
