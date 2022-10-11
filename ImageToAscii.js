// ASCII shades for black background : t P F O Q B A N W M (works best with canvas's default monospace font)
// ASCII shades for white background : % a t = ! ~ - : . "space" (works best with canvas's default monospace font)
// 4 shades with only dots and space : space . : ;



const ASCIIDOTS = [' ', '.', ':', ';']
const ASCIIBLACKBG = ['t', 'P', 'F', 'O', 'Q', 'B', 'A', 'N', 'W', 'M']
const ASCIIWHITEBG = ['%', 'a', 't', '=', '!', '~', '-', ':', '.', ' ']
const RESOLUTION = 64
const CANVASWIDTH = 1000
const CANVASHEIGHT = 1000

const canvas = document.getElementById("drawingBoard")
canvas.width = CANVASWIDTH
canvas.height = CANVASHEIGHT
const context = canvas.getContext('2d')
const submit = document.getElementById("submit")
const imageInput = document.getElementById("imageInput")



submit.onclick = () => {
    let img = imageInput.files[0]
    let imgBlob = new Blob([img], {type : 'image/jpeg'})
    let url = window.URL.createObjectURL(imgBlob)
    

    let imagePreview = document.createElement('img')
    imagePreview.src = url

    //imagePreview.onload = () => context.drawImage(imagePreview,0,0,RESOLUTION,RESOLUTION)
    drawAscii(imagePreview, ASCIIDOTS)


}

function drawAscii(image, asciiShades) {
    image.onload = () => {
        context.drawImage(image, 0, 0, RESOLUTION, RESOLUTION)
        let imageData = context.getImageData(0, 0, RESOLUTION, RESOLUTION)
        let rgbaData = Array.from(imageData.data)
        let grayScale = []
        let asciiArray = []

        context.clearRect(0, 0, canvas.width, canvas.height)

        //getting grayscale values from RGB values : (R+G+B)/3
        for(let i=0; i<rgbaData.length; i+=4){
            grayScale.push(Math.round((rgbaData[i] + rgbaData[i+1] + rgbaData[i+2])/3))
        }

        //calculating the corresponding ASCII characters from grayscale values
        for(let i=0; i<grayScale.length; i++){
            let shades = 255/asciiShades.length
            asciiArray.push(asciiShades[Math.floor(grayScale[i]/shades)])
        }

        context.font = "20px monospace"
        context.fillStyle = "white"

        //drawing ASCII characters on the canvas
        for(let i=0; i<RESOLUTION; i++){
            context.fillText(asciiArray.slice(i*RESOLUTION, i*RESOLUTION + RESOLUTION).join(""), 20, 20 + i*15)
        }
    }

}


