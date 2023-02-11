// ASCII shades examples: [" ",".","-",":",";","~","(",")","=","%","&","@","#"] or [" ",".",":",";"]

const drawingBoard = document.getElementById("drawingBoard");
const themeToggle = document.getElementById("theme-switcher");
const sideBarToggle = document.getElementById("side-bar-toggle");
const submit = document.getElementById("submit");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("previewImg");
const fontColorPicker = document.getElementById("fontColorPicker");
const backGroundColorPicker = document.getElementById("backGroundColorPicker");
const resolutionRange = document.getElementById("resolutionRange");
const asciiShadesInput = document.getElementById("asciiShadesInput");

let image;
let resWidth;
let resHeight;
let asciiShades = [" ", ".", ":", ";"];

themeToggle.onclick = () => {
  const root = document.querySelector(":root");
  const themeSwitcherLabel = document.querySelector(".theme-switcher-label");

  root.toggleAttribute("light");

  themeSwitcherLabel
    .querySelectorAll(".icon")
    .forEach((icon) => icon.classList.toggle("collapse"));
};

sideBarToggle.onclick = () => {
  const sideBarToggleLabel = document.querySelector(".side-bar-toggle-label");
  const sideBar = document.getElementById("sideBar");
  const workSpace = document.getElementById("workSpace");

  sideBar.toggleAttribute("collapse");
  workSpace.toggleAttribute("fullScreen");
  sideBarToggleLabel
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
    let aspectRatio = image.naturalHeight / image.naturalWidth;

    resHeight = parseInt(resolutionRange.value);
    resWidth = Math.round(resHeight / aspectRatio);

    drawAscii(
      getAsciiArray(image, asciiShades, resWidth, resHeight),
      resWidth,
      resHeight
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
  if (image === undefined) return;

  let aspectRatio = resHeight / resWidth;

  resHeight = parseInt(resolutionRange.value);
  resWidth = Math.round(resHeight / aspectRatio);

  drawAscii(
    getAsciiArray(image, asciiShades, resWidth, resHeight),
    resWidth,
    resHeight
  );
};

asciiShadesInput.onchange = () => {
  let input = asciiShadesInput.value;

  if (input.length < 1 || image === undefined) return;

  asciiShades = input.split("");

  drawAscii(
    getAsciiArray(image, asciiShades, resWidth, resHeight),
    resWidth,
    resHeight
  );
};

function getAsciiArray(image, asciiShades, width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let imageData;
  let rgbaData;
  let grayScale = [];
  let asciiArray = [];

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  imageData = context.getImageData(0, 0, width, height);
  rgbaData = Array.from(imageData.data);

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
    let shades = 256 / asciiShades.length;

    asciiArray.push(asciiShades[Math.floor(grayScale[i] / shades)]);
  }

  return asciiArray;
}

//draw the ASCII characters as text on an html element
function drawAscii(asciiArray, width, height) {
  drawingBoard.innerHTML = "";
  drawingBoard.style.fontFamily = "monospace";
  drawingBoard.style.lineHeight = 0.75;

  for (let i = 0; i < height; i++) {
    drawingBoard.append(
      document.createTextNode(
        asciiArray.slice(i * width, i * width + width).join("")
      )
    );

    drawingBoard.append(document.createElement("br"));
  }

  drawingBoard.style.width = "fit-content";
  drawingBoard.style.height = "fit-content";
}
