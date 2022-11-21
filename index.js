let canvas = document.querySelector("canvas")
let c = canvas.getContext("2d")
let tool = document.querySelectorAll(".tool")
let fillColor = document.querySelector("#fill")
let sliderSize = document.querySelector("#slider")
let colorBtns = document.querySelectorAll(".color")
let colorPicker = document.querySelector("#color-picker")
let clearCanvas = document.querySelector("#btn1")
let saveCanvas = document.querySelector("#btn2")

let isDrawing = false
let brushWidth = 5
let prevMouseX , snapShot
let prevMouseY 
let selectedTool = 'brush',
    selectedColor = 'black'

const setCanvasBackground = () => {
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = selectedColor
    }
window.addEventListener("load", ()=> {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})
let drawRect = (e) => {
    if (!fillColor.checked) {
        return c.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    c.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}
let drawTriangle = (e) => {
    c.beginPath()
    c.moveTo(prevMouseX, prevMouseY)
    c.lineTo(e.offsetX, e.offsetY)
    c.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    c.closePath()
    if (!fillColor.checked) {
        return c.stroke()
    }
    return c.fill()

}
let drawCircle = (e) => {
    c.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX-e.offsetX),2) + Math.pow((prevMouseX-e.offsetX),2))
    c.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI)
    if (!fillColor.checked) {
        c.stroke()
    } else {
        c.fill()
    }
    // c.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}
let drawing = (e) => {
    if (!isDrawing) return;
    c.putImageData(snapShot,0,0)
    if (selectedTool == 'brush' || selectedTool == 'erase') {
        c.strokeStyle = selectedTool === 'erase' ? "white" : selectedColor
        c.lineTo(e.offsetX, e.offsetY)
        c.stroke()
    } else if (selectedTool == "rect") {
        drawRect(e)
    }
    else if (selectedTool == "circle") {
        drawCircle(e)
    }
    else {
        drawTriangle(e)
    }
}
let startDrawing = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    c.beginPath()
    c.lineWidth = brushWidth;
    c.strokeStyle = selectedColor
    c.fillStyle = selectedColor
    snapShot =c.getImageData(0,0,canvas.width, canvas.height)
}
tool.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".active").classList.remove('active')
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(selectedTool);
    })
})

sliderSize.addEventListener("change", () => brushWidth = sliderSize.value)
colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".selected").classList.remove('selected')
        btn.classList.add("selected")
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
})
})
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})
clearCanvas.addEventListener("click", () => {
    c.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
})
saveCanvas.addEventListener("click", () => {
    let link = document.createElement('a')
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})
canvas.addEventListener("mousemove",drawing)
canvas.addEventListener("mousedown",startDrawing)
canvas.addEventListener("mouseup",()=> isDrawing = false )