import { BSPTree } from "./components/BSPTree";
import { Dot } from "./model/Dot";
import { getRandomInt, getRandomNumber } from "./utility";

export class World {
  constructor(canvas) {
    this.dots = [];
    this.connectionRadius = 200;
    const dotCount = 200; 
    let created = 0; 
    while (created++ < dotCount) {
      const speedMax = 1; 
      this.dots.push(new Dot({
        x:getRandomInt(0, canvas.width), 
        y:getRandomInt(0, canvas.height),
        dx:getRandomNumber(-speedMax, speedMax),
        dy:getRandomNumber(-speedMax, speedMax), // Note, will have more speed towards corners. 
        size:getRandomNumber(2, 10),
        connections: []
      }));
    }
  }

  update() {
    this.moveObjects();
    this.collideObjects();
    this.accellerate();
  }

  moveObjects() {
    for (let dot of this.dots) {
      dot.x += dot.dx;
      dot.y += dot.dy;
    }
  }

  collideObjects() {
    this.collideWithWalls();
    this.BSPTree = new BSPTree(this.dots, 0, this.dots.length-1);
    for (let dot of this.dots) {
      let connections = this.BSPTree.circleCollision(dot, this.connectionRadius);
      connections = connections.filter(otherDot => otherDot.id < dot.id);  // Note: Id check guarantees unique edges.
      dot.connections = connections;
    }
  }

  collideWithWalls() {
    for(let dot of this.dots) {
      if (dot.x < 0) dot.dx = -dot.dx;
      if (canvas.width < dot.x) dot.dx = -dot.dx;
      if (dot.y < 0) dot.dy = -dot.dy;
      if (canvas.height < dot.y) dot.dy = -dot.dy;
    }
  }

  accellerate() {}

  render(canvas, averageFramesPerSecond) {
    let context = canvas.getContext("2d");

    // Clear frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Debug, render BSP tree
    // this.BSPTree.render(context, 5);
     
    // Render all dots
    this.dots.forEach((dot) => {
      dot.render(context, this.connectionRadius);
    })

    // Render FPS
    context.font = "20px serif";
    context.moveTo(0,0);
    context.fillText("FPS: " + Math.round(averageFramesPerSecond), 10, 50);
    context.moveTo(0,0);
  }
}


