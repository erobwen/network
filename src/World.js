import { BSPTree } from "./BSPTree";
import { Dot } from "./Dot";
import { getRandomInt, getRandomNumber } from "./utility";

const log = console.log;

export class World {
  constructor(canvas) {
    this.dots = [];
    this.connectionRadius = 300;
    const dotCount = 100; 
    let created = 0; 
    while (created++ < dotCount) {
      this.dots.push(new Dot({
        id: created,
        x:getRandomInt(0, canvas.width), 
        y:getRandomInt(0, canvas.height),
        dx:getRandomNumber(-0.5, 0.5),
        dy:getRandomNumber(-0.5, 0.5), // Note, will have more speed towards corners. 
        size:getRandomNumber(2, 10),
        connections: []
      }));
    }
  }

  update() {
    this.moveObjects();
    this.collideObjects();
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
      dot.connections = this.BSPTree.circleCollision(dot, this.connectionRadius);
      // console.log(dot.connections);
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

  render(canvas, averageFramesPerSecond) {
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
    this.dots.forEach((dot) => {
      context.beginPath();
      context.arc(dot.x, dot.y, 10, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = 'black';
      context.stroke();
      context.moveTo(0,0);

      dot.connections.forEach((otherDot) => {
        const strength = (this.connectionRadius - otherDot.distance)/this.connectionRadius;
        const color = `rgba(0, 0, 0, ${strength})`
        context.beginPath();
        context.lineWidth = Math.round(10 * strength);
        context.strokeStyle = color;
        context.moveTo(dot.x, dot.y);
        context.lineTo(otherDot.x, otherDot.y);
        context.stroke();
      })
    })

    this.renderBSPTree(this.BSPTree, 5);
  }

  renderBSPTree(bspTree, level) {
    const context = canvas.getContext("2d");
    context.lineWidth = Math.max(level, 1);
    if (bspTree.pivotValue === null) return;

    if (bspTree.horizontal) {
      const topBound = Math.max(0, (bspTree.bounds.minY !== null) ? bspTree.bounds.minY : 0);
      const bottomBound = Math.min(canvas.height, (bspTree.bounds.maxY !== null) ? bspTree.bounds.maxY : canvas.height);
      // debugger; 
      context.beginPath();
      context.moveTo(bspTree.pivotValue, topBound);
      context.lineTo(bspTree.pivotValue, bottomBound);
      context.stroke();
    } else {
      const leftBound = Math.max(0, (bspTree.bounds.minX !== null) ? bspTree.bounds.minX : 0);
      const rightBound = Math.min(canvas.width, (bspTree.bounds.maxX !== null) ? bspTree.bounds.maxX : canvas.width);
      context.beginPath();
      context.moveTo(leftBound, bspTree.pivotValue);
      context.lineTo(rightBound, bspTree.pivotValue);
      context.stroke();
    }

    if (bspTree.lowPartition) {
      this.renderBSPTree(bspTree.lowPartition, level-1);
    }

    if (bspTree.highPartition) {
      this.renderBSPTree(bspTree.highPartition, level-1);
    }
  }
}


