import { Dot } from "./Dot";
export let canvas = document.getElementById("canvas");
canvas.width = canvas.getClientRects()[0].width;
canvas.height = canvas.getClientRects()[0].height;

function getTimestamp() {
  let d = new Date();
  return d.getTime();
}

async function releaseControl(time) {
  if (typeof(time) === "undefined") time = 0;
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve()} , time);
  })
}


console.log("here")

/**
 *  Game loop core
 */ 
// Actual frame speed
let framesPerSecond = 100.0; // Initial estimate, will be ajusted dynamically
let lastFramesPerSecond = 100.0;
let frameDuration = 1000.0 / framesPerSecond; // Initial estimate, will be ajusted dynamically.

// Set limitations
let framesPerSecondMax = 100.0;
let frameDurationMin = 1000.0 / framesPerSecondMax; 

let averageFramesPerSecond = framesPerSecond;

const testDot = new Dot({x: 50, y: 50});
console.log(testDot);

async function renderloop() {
  let loopStartTimestamp = null;
  while(true) {
    console.log("renderLoop")
    loopStartTimestamp = getTimestamp();

    // Perform all actions
    // accellerateObjects();
    moveObjects();
    // collideObjects();
    renderWorld();
    await releaseControl(0); // To make drawing happen
    
    const loopEndTimeStamp = getTimestamp();
    frameDuration = loopEndTimeStamp - loopStartTimestamp;
    lastFramesPerSecond = framesPerSecond;
    framesPerSecond = Math.min(1000.0 / frameDuration, framesPerSecondMax);
    averageFramesPerSecond = (averageFramesPerSecond + framesPerSecond) / 2;

    const waitTime = Math.max(0, frameDurationMin - frameDuration);
    await releaseControl(waitTime);
  }    
}

renderloop()

console.log(canvas);

function moveObjects() {
  // console.log(testDot.x);
  testDot.x += 1;
  testDot.y += 1;
} 

function renderWorld() {
  let context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.moveTo(0,0);

  context = canvas.getContext("2d");
  context.font = "12px serif";
  context.moveTo(0,0);
  context.fillText("FPS: " + averageFramesPerSecond, 10, 50);
  context.moveTo(0,0);
  
  context = canvas.getContext("2d");
  context.beginPath();
  context.arc(testDot.x, testDot.y, 10, 0, 2 * Math.PI, false);
  context.fillStyle = 'black';
  context.fill();
  context.lineWidth = 5;
  context.strokeStyle = 'black';
  context.stroke();
  context.moveTo(0,0);
}