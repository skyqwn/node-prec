const img = document.querySelector("img");
const title = document.querySelector("input[name=title]");
const desc = document.querySelector("input[name=desc]");
const file = document.querySelector("input[name=file]");

file.style.display = "none";

const paintPreview = (file) => {
  const previousBlob = img.src;
  URL.revokeObjectURL(previousBlob);
  const blob = URL.createObjectURL(file);
  img.src = blob;
};

const changeImage = (e) => {
  const files = e.target.files;
  const file = files[0];
  const blob = URL.createObjectURL(file);
  img.src = blob;
};

img.addEventListener("click", () => file.click());
file.addEventListener("change", changeImage);
