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
 *  Render loop
 */ 

// Actual frame speed
let framesPerSecond = 100.0; // Initial estimate, will be ajusted dynamically
let lastFramesPerSecond = 100.0;
let frameDuration = 1000.0 / framesPerSecond; // Initial estimate, will be ajusted dynamically.
let averageFramesPerSecond = framesPerSecond;

// FPS set limitations
let framesPerSecondMax = 500.0;
let frameDurationMin = 1000.0 / framesPerSecondMax; 

// To terminate
let running = true; 

async function renderloop() {
  let loopStartTimestamp = null;
  while(running) {
    loopStartTimestamp = getTimestamp();

    // Perform all actions
    world.update(frameDuration);
    world.render(canvas, averageFramesPerSecond);

    // To make drawing happen
    await releaseControl(0); 
    
    // Calculate FPS
    const loopEndTimeStamp = getTimestamp();
    frameDuration = loopEndTimeStamp - loopStartTimestamp;
    lastFramesPerSecond = framesPerSecond;
    framesPerSecond = Math.min(1000.0 / frameDuration, framesPerSecondMax);
    averageFramesPerSecond = (averageFramesPerSecond + framesPerSecond) / 2;

    // Wait if FPS is capped and we are early. 
    const waitTime = Math.max(0, frameDurationMin - frameDuration);
    await releaseControl(waitTime);
  }    
}

renderloop()


// setTimeout(() => { running = false; }, 5000);