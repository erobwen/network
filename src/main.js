import { getTimestamp, releaseControl } from "./utility";
import { World } from "./World";

/**
 * Setup canvas
 */
export let canvas = document.getElementById("canvas");
canvas.width = canvas.getClientRects()[0].width;
canvas.height = canvas.getClientRects()[0].height;

/**
 * Create world
 */
const world = new World(canvas);

/**
 *  Game loop core
 */ 
// Actual frame speed
let framesPerSecond = 100.0; // Initial estimate, will be ajusted dynamically
let lastFramesPerSecond = 100.0;
let frameDuration = 1000.0 / framesPerSecond; // Initial estimate, will be ajusted dynamically.
let averageFramesPerSecond = framesPerSecond;

// Set limitations
let framesPerSecondMax = 200.0;
let frameDurationMin = 1000.0 / framesPerSecondMax; 

let running = true; 

async function renderloop() {
  let loopStartTimestamp = null;
  while(running) {
    loopStartTimestamp = getTimestamp();

    // Perform all actions
    world.update(frameDuration);
    world.render(canvas, averageFramesPerSecond);
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


setTimeout(() => { running = false; }, 5000);