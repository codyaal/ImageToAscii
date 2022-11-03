// ASCII shades for black background : t P F O Q B A N W M
// ASCII shades for white background : % a t = ! ~ - : . space
// 4 shades with only dots and special characters : space . : ;

const ASCIIDOTS = [" ", ".", ":", ";"];
const ASCIIBLACKBG = ["t", "P", "F", "O", "Q", "B", "A", "N", "W", "M"];
const ASCIIWHITEBG = ["%", "a", "t", "=", "!", "~", "-", ":", ".", " "];
const RESOLUTION = 200;

const drawingBoard = document.getElementById("drawingBoard");
const themeToggle = document.getElementById("theme-switcher");
const submit = document.getElementById("submit");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("previewImg");
const fontColorPicker = document.getElementById("fontColorPicker");
const backGroundColorPicker = document.getElementById("backGroundColorPicker");
const resolutionRange = document.getElementById("resolutionRange");
const asciiShadesInput = document.getElementById("asciiShadesInput");

let image;
let asciiShades = [" ", ".", ":", ";"];

themeToggle.onclick = () => {
  const root = document.querySelector(":root");
  const themeSwitcher = document.querySelector(".theme-switcher-label");
  root.toggleAttribute("light");
  themeSwitcher
    .querySelectorAll(".icon")
    .forEach((icon) => icon.classList.toggle("collapse"));
};

imageInput.onchange = () => {
  let img = imageInput.files[0];
  let imgBlob = new Blob([img], { type: "image/jpeg" });
  let url = window.URL.createObjectURL(imgBlob);

  image = document.createElement("img");
  image.src = url;
  imagePreview.style.backgroundImage = `url("${url}")`;

  image.onload = () => {
    drawAsciiOnParagraph(
      getAsciiArray(image, asciiShades, parseInt(resolutionRange.value)),
      parseInt(resolutionRange.value)
    );
  };
};

fontColorPicker.onchange = () => {
  drawingBoard.style.color = fontColorPicker.value;
  document.getElementsByClassName("colorPicker")[0].style.backgroundColor =
    fontColorPicker.value;
};

backGroundColorPicker.onchange = () => {
  drawingBoard.style.backgroundColor = backGroundColorPicker.value;
  document.getElementsByClassName("colorPicker")[1].style.backgroundColor =
    backGroundColorPicker.value;
};

resolutionRange.onchange = () => {
  if (drawingBoard.innerHTML != "") {
    drawAsciiOnParagraph(
      getAsciiArray(image, asciiShades, parseInt(resolutionRange.value)),
      parseInt(resolutionRange.value)
    );
  }
};

asciiShadesInput.onchange = () => {
  let input = asciiShadesInput.value;
  if (input.length < 2) return;
  asciiShades = input.split("");
  drawAsciiOnParagraph(
    getAsciiArray(image, asciiShades, parseInt(resolutionRange.value)),
    parseInt(resolutionRange.value)
  );
};

function getAsciiArray(image, asciiShades, resolution) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = resolution;
  canvas.height = resolution;
  context.drawImage(image, 0, 0, resolution, resolution);
  let imageData = context.getImageData(0, 0, resolution, resolution);
  let rgbaData = Array.from(imageData.data);
  let grayScale = [];
  let asciiArray = [];

  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;

  //getting grayscale values from RGB values : (R+G+B)/3
  for (let i = 0; i < rgbaData.length; i += 4) {
    grayScale.push(
      Math.round((rgbaData[i] + rgbaData[i + 1] + rgbaData[i + 2]) / 3)
    );
  }

  //calculating the corresponding ASCII characters from grayscale values
  for (let i = 0; i < grayScale.length; i++) {
    let shades = 255 / asciiShades.length;
    asciiArray.push(asciiShades[Math.floor(grayScale[i] / shades)]);
  }

  return asciiArray;
}

//draw the ASCII characters as text on an html element
function drawAsciiOnParagraph(asciiArray, resolution) {
  drawingBoard.innerHTML = "";
  drawingBoard.style.fontFamily = "monospace";
  drawingBoard.style.lineHeight = 0.75;

  for (let i = 0; i < resolution; i++) {
    drawingBoard.append(
      document.createTextNode(
        asciiArray.slice(i * resolution, i * resolution + resolution).join("")
      )
    );
    drawingBoard.append(document.createElement("br"));
  }
  drawingBoard.style.width = "fit-content";
  drawingBoard.style.height = "fit-content";
}
