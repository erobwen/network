
let nextId = 0;

export class Dot {
  constructor({id, x, y, dx, dy, size, connectionRadius}) {
    this.id = nextId++;
    this.x = x; 
    this.y = y; 
    this.dx = dx; 
    this.dy = dy; 
    this.size = size; 
    this.connectionRadius = connectionRadius;
    this.connections=[];
  }

  distanceTo(otherDot) {
    const dx = Math.abs(this.x - otherDot.x);
    const dy = Math.abs(this.y - otherDot.y);
    return Math.sqrt(dx*dx + dy*dy);
  }
}