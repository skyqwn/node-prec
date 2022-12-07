"use strict";

var img = document.getElementById("preview");
var title = document.querySelector("input[name=title]");
var desc = document.querySelector("input[name=desc]");
var file = document.querySelector("input[type=file]");

file.style.display = "none";

var paintPreview = function paintPreview(file) {
  var previousBlob = img.src;
  URL.revokeObjectURL(previousBlob);
  var blob = URL.createObjectURL(file);
  img.src = blob;
};

var changeImage = function changeImage(e) {
  var files = e.target.files;
  var file = files[0];
  var blob = URL.createObjectURL(file);
  img.src = blob;
};

img.addEventListener("click", function () {
  file.click();
});
file.addEventListener("change", changeImage);