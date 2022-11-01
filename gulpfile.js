import gulpPkg from "gulp";
import clean from "gulp-clean";
const { src, dest, watch, series } = gulpPkg;

import defaultSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(defaultSass);

import babel from "gulp-babel";
import uglify from "gulp-uglify";

const js = (cb) => {
  return src("./src/js/**/*.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest("static/js"));
  cb();
};

const css = (cb) => {
  return src("./src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("static/css"));
  cb();
};

const cleanJs = (cb) => {
  src("./static/js/*.js").pipe(clean({ read: false }));
  cb();
};
const cleanCss = (cb) => {
  src("./static/css/*.js").pipe(clean({ read: false }));
  cb();
};

const watchFile = () => {
  watch("./src/js/**/*.js", cleanJs);
  watch("./src/sass/**/*.scss", cleanCss);

  watch("./src/js/**/*.js", js);
  watch("./src/sass/**/*.scss", css);
};

export default series(cleanStatic, js, css, watchFile);
