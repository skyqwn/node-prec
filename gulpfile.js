import gulpPkg from "gulp";
import clean from "gulp-clean";
import dotenv from "dotenv";
dotenv.config();
const { src, dest, watch, series } = gulpPkg;

import defaultSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(defaultSass);

import babel from "gulp-babel";
import uglify from "gulp-uglify";

const js = (cb) => {
  src("./src/js/**/*.js").pipe(babel()).pipe(uglify()).pipe(dest("static/js"));
  cb();
};

const css = (cb) => {
  src("./src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("static/css"));
  cb();
};

const images = (cb) => {
  src("./src/images/*").pipe(dest("static/images"));
  cb();
};

const cleanJs = (cb) => {
  src("./static/js/*.js").pipe(clean({ read: false }));
  cb();
};

const cleanimages = (cb) => {
  src("./static/images/*").pipe(clean({ read: false }));
  cb();
};

const watchFile = () => {
  watch("./src/js/**/*.js", cleanJs);
  watch("./src/images/*", cleanimages);
  watch("./src/js/**/*.js", js);
  watch("./src/images/*", images);
  watch("./src/sass/**/*.scss", css);
};

export const dev = series(js, css, images, watchFile);
export const prod = series(js, css, images);
