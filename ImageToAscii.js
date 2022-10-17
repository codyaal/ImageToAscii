// ASCII shades for black background : t P F O Q B A N W M
// ASCII shades for white background : % a t = ! ~ - : . `
// 4 shades with only dots and space : ` . : ;

const ASCIIDOTS = ["`", ".", ":", ";"];
const ASCIIBLACKBG = ["t", "P", "F", "O", "Q", "B", "A", "N", "W", "M"];
const ASCIIWHITEBG = ["%", "a", "t", "=", "!", "~", "-", ":", ".", "`"];
const RESOLUTION = 200;

let inputChanged = false;

const drawingBoard = document.getElementById("drawingBoard");
const submit = document.getElementById("submit");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("previewImg");

imageInput.onchange = () => {
  inputChanged = true;
  imagePreview.style.backgroundImage =
    "url('" + window.URL.createObjectURL(imageInput.files[0]) + "')";
};

submit.onclick = () => {
  if (inputChanged) {
    let img = imageInput.files[0];
    let imgBlob = new Blob([img], { type: "image/jpeg" });
    let url = window.URL.createObjectURL(imgBlob);

    let image = document.createElement("img");
    image.src = url;

    image.onload = () => {
      drawAsciiOnParagraph(getAsciiArray(image, ASCIIWHITEBG));
    };
    inputChanged = false;
  }
};

function getAsciiArray(image, asciiShades) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = RESOLUTION;
  canvas.height = RESOLUTION;
  context.drawImage(image, 0, 0, RESOLUTION, RESOLUTION);
  let imageData = context.getImageData(0, 0, RESOLUTION, RESOLUTION);
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
function drawAsciiOnParagraph(asciiArray) {
  drawingBoard.innerHTML = "";
  drawingBoard.style.fontFamily = "monospace";
  drawingBoard.style.lineHeight = 0.75;

  for (let i = 0; i < RESOLUTION; i++) {
    drawingBoard.append(
      document.createTextNode(
        asciiArray.slice(i * RESOLUTION, i * RESOLUTION + RESOLUTION).join("")
      )
    );
    drawingBoard.append(document.createElement("br"));
  }
  drawingBoard.style.width = "fit-content";
  drawingBoard.style.height = "fit-content";
}