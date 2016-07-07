import * as gulp from 'gulp';
import tslint from 'gulp-tslint';
import * as project from '../aurelia.json';

export default gulp.series(
  runTSLint
);

function runTSLint() {
  return gulp.src(project.transpiler.source)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: false
    }));
}